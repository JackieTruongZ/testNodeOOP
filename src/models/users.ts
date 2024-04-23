const { MongoClient, ObjectId } = require('mongodb');

class UserModel {
    private url: string;
    private dbName: string;
    private collectionName: string;
    private client: any;
    private db: any;
    private collection: any;
    constructor() {
        this.url = 'mongodb://localhost:27017';
        this.dbName = 'mydatabase';
        this.collectionName = 'users';
    }

    async connect() {
        try {
            this.client = await MongoClient.connect(this.url);
            this.db = this.client.db(this.dbName);
            this.collection = this.db.collection(this.collectionName);
            console.log('Đã kết nối thành công đến cơ sở dữ liệu MongoDB');
        } catch (err) {
            console.error('Lỗi kết nối đến cơ sở dữ liệu:', err);
        }
    }

    async createUser(user) {
        try {
            const result = await this.collection.insertOne(user);
            return result.insertedId;
        } catch (err) {
            console.error('Lỗi khi tạo người dùng:', err);
            return null;
        }
    }

    async getUserById(id) {
        try {
            const user = await this.collection.findOne({ _id: ObjectId(id) });
            return user;
        } catch (err) {
            console.error('Lỗi khi lấy người dùng:', err);
            return null;
        }
    }

    async updateUser(id, updates) {
        try {
            const result = await this.collection.updateOne(
                { _id: ObjectId(id) },
                { $set: updates }
            );
            return result.modifiedCount;
        } catch (err) {
            console.error('Lỗi khi cập nhật người dùng:', err);
            return 0;
        }
    }

    async deleteUser(id) {
        try {
            const result = await this.collection.deleteOne({ _id: ObjectId(id) });
            return result.deletedCount;
        } catch (err) {
            console.error('Lỗi khi xóa người dùng:', err);
            return 0;
        }
    }

    async disconnect() {
        try {
            await this.client.close();
            console.log('Đã đóng kết nối đến cơ sở dữ liệu MongoDB');
        } catch (err) {
            console.error('Lỗi khi đóng kết nối:', err);
        }
    }
}