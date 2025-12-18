class User {
    nickname;
    username;
    id;
    email;
    permissions;
    constructor(userData) {
        this.nickname = userData.nickname?.S;
        this.username = userData.username?.S;
        this.email = userData.email.S;
        this.id = userData.id.S;
        this.permissions = userData.permissions?.SS || [];
    }
}
export default User;
