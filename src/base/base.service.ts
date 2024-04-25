import { db } from "@/databases/db";
import { HttpException } from "@/exceptions/HttpException";
import { hash } from "bcrypt";
import { isEmpty } from "class-validator";
import { Filter, InsertOneResult, ObjectId, OptionalUnlessRequiredId, WithId } from "mongodb";


abstract class baseService<TBase, TCreateDto> {

    protected abstract collectionName: string;
    protected abstract nameBase: string;
    protected abstract attributeBase: string;
    protected abstract listAttribute: string[];


    /*
        Find all service
    */

    public async findAll(): Promise<any> {

        const data: Omit<TBase, '_id'>[] = await db.collection<TBase>(this.collectionName).find({}).toArray();
        return data;

    }

    /*
        Find by Id service
   */

    public async findById(dataId: string): Promise<any> {

        // Check data empty
        if (isEmpty(dataId)) throw new HttpException(400, `${this.nameBase}Id is empty`);

        // create query
        const query: Filter<TBase> = { _id: new ObjectId(dataId) } as Filter<TBase>;

        // query 
        const findData: Omit<TBase, '_id'> = await db.collection<TBase>(this.collectionName).findOne(query);

        // Exception handle
        if (!findData) throw new HttpException(409, `${this.nameBase} doesn't exist`);

        return findData;
    }

    /*
        Create  service
    */

    public async create(createData: TCreateDto): Promise<any> {

        // Check data empty
        if (isEmpty(createData)) throw new HttpException(400, `${this.nameBase} data is empty`);

        // check attribute base exist  =========================

        // create query
        const query: Filter<TBase> = { [this.attributeBase]: createData[this.attributeBase] } as Filter<TBase>;

        // query 
        const findData: Omit<TBase, '_id'> = await db.collection<TBase>(this.collectionName).findOne(query);

        // Exception handle
        if (findData) throw new HttpException(409, `This ${this.attributeBase} ${createData[this.attributeBase]} already exists`);

        // end check attribute base exist  =========================


        let saveData: any;

        // if create user we should hash password before save data

        if (this.listAttribute.includes('password')) {
            const hashedPassword = await hash((createData as any).password, 10);
            saveData = await db.collection<any>(this.collectionName).insertOne({ ...createData, password: hashedPassword });
        }
        else {
            saveData = await db.collection<any>(this.collectionName).insertOne(createData);
        }
        return saveData;
    }

    /*
        Update service
    */

    public async update(dataId: string, updateData: TCreateDto): Promise<any> {

        // Check data empty
        if (isEmpty(updateData)) throw new HttpException(400, `${this.nameBase} Data is empty`);

        // check attribute base exist  =========================

        if (updateData[this.attributeBase]) {

            // create query
            const query: Filter<TBase> = { [this.attributeBase]: updateData[this.attributeBase] } as Filter<TBase>;

            // query
            const findData: WithId<TBase> = await db.collection<TBase>(this.collectionName).findOne(query) as WithId<TBase>;

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

        // create query
        const query: Filter<TBase> = { _id: new ObjectId(dataId) } as Filter<TBase>;

        // query
        const findData: Omit<TBase, '_id'> = await db.collection<TBase>(this.collectionName).findOne(query);

        let updatedData: any;
        if (findData) {
            // Update the user's data
            updatedData = { ...findData, ...updateData };

            // Update handle  ==================== 

            // create query
            const updateQuery: Filter<TBase> = { _id: new ObjectId(dataId) } as Filter<TBase>;

            // query
            await db.collection(this.collectionName).updateOne(updateQuery, { $set: updatedData });

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

    public async delete(dataId: string): Promise<any> {

        // check exist

        // create query
        const query: Filter<TBase> = { _id: new ObjectId(dataId) } as Filter<TBase>;

        // query
        const findData: Omit<TBase, '_id'> = await db.collection<TBase>(this.collectionName).findOne(query);

        let result: any;
        if (findData) {
            // query delete
            result = await db.collection(this.collectionName).deleteOne({ _id: new ObjectId(dataId) });

        } else {
            // Exception handle
            throw new HttpException(409, `${this.nameBase} doesn't exist`);
        }
        //======================
        return result;
    }
}

export default baseService;