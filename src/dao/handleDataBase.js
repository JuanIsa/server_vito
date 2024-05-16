class DataBase {
    async findLastId(dataBase) {
        try {
            const lastElement = await dataBase.findOne().sort({ id: -1 });
            if (lastElement) {
                return lastElement.id;
            } else {
                return 0;
            }
        } catch (error) {
            return -1;
        }
    }
}
export default DataBase;