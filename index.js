const express = require('express');

const roles = require('./roles');

const app = express();
const port = 3001;

class Role {
  constructor() {
    this.roles = roles.roles;
  }

  getRoleByName(name) {
    return this.roles.find((role) => role.name === name);
  }

  getRoles() {
    return this.roles;
  }
}

class Permissions {
  constructor() {
    this.permissions = [];
  }

  getPermissionsByRoleName(roleName) {
    const role = roles.roles.find((r) => r.name === roleName);
    return role ? role.permissions : [];
  }
}

const checkPerms = (permission) => {
  return (req, res, next) => {
    /**
     * STEPS
     * 
        1. Get the shop the user has just logged into.
        2. Use shop slug to get shop ID.
        3. Use shop ID to get the user's role.
        4. Use the user's role to get the user's permissions.
        5. Check if the user's permissions includes the permission we are checking for.
     * 
     * 
     */

    const userRole = req.user ? req.user.role : 'anonymous';
    const userPermissions = new Permissions().getPermissionsByRoleName(
      userRole
    );

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
};

app.get('/hello', async (req, res) => {
  const { url } = req.query;

  const permission = new Permissions();
  const permissions = permission.getPermissionsByRoleName('manager');

  console.log(permissions);

  return res.status(200).send('Hello');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
