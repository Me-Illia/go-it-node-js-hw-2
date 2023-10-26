const ctrlWrapper = ctrl => {
    const func = async (req, res, next) => { // + next параметр для оптимізації catch (error)
        try {
            await ctrl(req, res, next);
        } catch (error) {
            next(error);
        }
    }
    return func;
}

export default ctrlWrapper;