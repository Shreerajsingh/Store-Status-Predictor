class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const response = await this.model.create(data);
            console.log("Record created:", response);
            return response;
        } catch (error) {
            console.error("Error creating record:", error);
            throw error;
        }
    }

    async destroy(id) {
        const response = await this.model.destroy({
            where: {
                id: id
            }
        });
        if(!response) {
            throw new AppError('Not able to fund the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async get(reportId) {
        const response = await this.model.findOne({ where: { report_name: reportId } });
        if(!response) {
            throw new AppError('Not able to fund the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async getAll() {
        const response = await this.model.findAll();
        return response;
    }

    async update(id, data) {
        const response = await this.model.update(data, {
            where: {
                id: id
            }
        })
        return response;
    }
}

module.exports = CrudRepository;