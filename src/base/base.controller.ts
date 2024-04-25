import { NextFunction, Request, Response } from "express"

abstract class baseController<TBase, TCreateDto> {

    // using serivce abtract with type any
    protected abstract service: any;

    // implement on crud

    // get
    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllData: TBase[] = await this.service.findAll();

            res.status(200).json({ data: findAllData, message: 'findAll' });
        } catch (error) {
            next(error);
        }
    }

    // get by Id
    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Id: string = req.params.id;
            const findOneData: TBase = await this.service.findById(Id);

            res.status(200).json({ data: findOneData, message: 'findOne' });
        } catch (error) {
            next(error);
        }
    }

    // create
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Data: TCreateDto = req.body;
            const createData: TBase = await this.service.create(Data);

            res.status(201).json({ data: createData, message: 'created' });
        } catch (error) {
            next(error);
        }
    }

    // update
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Id: string = req.params.id;
            const Data: TCreateDto = req.body;
            const updateData: TBase = await this.service.update(Id, Data);

            res.status(200).json({ data: updateData, message: 'updated' });
        } catch (error) {
            next(error);
        }
    }

    // delete
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Id: string = req.params.id;
            const deleteData: TBase = await this.service.delete(Id);

            res.status(200).json({ data: deleteData, message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };
}

export default baseController;