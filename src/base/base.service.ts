import { HttpException } from "@/exceptions/HttpException";
import { hash } from "bcrypt";
import { isEmpty } from "class-validator";
import { WithId } from "mongodb";


abstract class BaseService<TBase, TCreateDto> {

    // query import
    protected abstract query: any;

    // attribute import 
    protected abstract collectionName: string;
    protected abstract nameBase: string;
    protected abstract attributeBase: string;
    protected abstract listAttribute: string[];


    /*
        Find all service
    */

    public findAll = async (): Promise<any> => {

        const data: Omit<TBase, '_id'>[] = await this.query.find();
        return data;

    }

    /*
        Find by Id service
   */

    public findById = async (dataId: string): Promise<any> => {

        // Check data empty
        if (isEmpty(dataId)) throw new HttpException(400, `${this.nameBase}Id is empty`);

        // query 
        const findData: Omit<TBase, '_id'> = await this.query.findById(dataId);

        // Exception handle
        if (!findData) throw new HttpException(409, `${this.nameBase} doesn't exist`);

        return findData;

    }

    /*
        Create  service
    */

    public create = async (createData: TCreateDto): Promise<any> => {

        // Check data empty
        if (isEmpty(createData)) throw new HttpException(400, `${this.nameBase} data is empty`);

        // check attribute base exist  =========================

        const findData: Omit<TBase, '_id'> = await this.query.findByAttribute(createData);

        // Exception handle
        if (findData) throw new HttpException(409, `This ${this.attributeBase} ${createData[this.attributeBase]} already exists`);

        // end check attribute base exist  =========================

        // save data
        const saveData = await this.query.saveData(createData);

        return saveData;

    }

    /*
        Update service
    */

    public update = async (dataId: string, updateData: TCreateDto): Promise<any> => {

        // Check data empty
        if (isEmpty(updateData)) throw new HttpException(400, `${this.nameBase} Data is empty`);

        // check attribute base exist  =========================

        if (updateData[this.attributeBase]) {

            // query
            const findData: WithId<TBase> = await this.query.findByAttributeWithoutId(updateData);

            // check exist
            if (findData && findData._id?.toString() !== dataId) {

                throw new HttpException(409, `This ${this.attributeBase} ${updateData[this.attributeBase]} already exists`);

            }

        }
        // end check attribute base exist  =========================

        if ((updateData as any).password) {

            const hashedPassword = await hash((updateData as any).password, 10);
            updateData = { ...updateData, password: hashedPassword };

        }

        // update infor ======================

        // query
        const findData: Omit<TBase, '_id'> = await this.query.findById(dataId);

        let updatedData: any;

        if (findData) {

            // create Updated data
            updatedData = { ...findData, ...updateData };

            // Update handle  ==================== 

            await this.query.updateData(dataId, updatedData);
            //====================

        } else {

            // Exception handle
            throw new HttpException(409, `${this.nameBase} doesn't exist`);

        }
        //======================

        return updatedData;

    }

    /*
        Delete  service
    */

    public delete = async (dataId: string): Promise<any> => {

        // check exist

        // query
        const findData: Omit<TBase, '_id'> = await this.query.findById(dataId);

        let result: any;

        // handle delete 

        if (findData) {

            // query delete
            result = await this.query.deleteById(dataId);

        } else {

            // Exception handle
            throw new HttpException(409, `${this.nameBase} doesn't exist`);

        }
        //======================

        return result;

    }
}

export default BaseService;