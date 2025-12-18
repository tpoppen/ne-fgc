import { fetchUser } from "../accessors/userAccessor.js";
const addPermissionsMiddleware = async (req, res, next) => {
    const user = await fetchUser({ userId: req.userId });
    if (!user) {
        return res.status(401).send({ message: "Not Authenticated" });
    }
    req.permissions = user.permissions;
    next();
};
export default addPermissionsMiddleware;
