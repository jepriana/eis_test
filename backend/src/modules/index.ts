import { Express, Request, Response, NextFunction } from "express"
import { authRoutes } from "./auth/auth.routes"
import { roleRoutes } from "./master/roles/role.routes"
import { unitRoutes } from "./master/units/unit.routes"
import { employeeRoutes } from "./master/employees/employee.routes"
import { employeeUnitRoleRoutes } from "./master/employee-unit-roles/employee-unit-role.routes"

export function appModules(app: Express) {
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, Content-Type, Accept',
        );
        next();
    });

    app.use('/', authRoutes);
    app.use('/', roleRoutes);
    app.use('/', unitRoutes);
    app.use('/', employeeRoutes);
    app.use('/', employeeUnitRoleRoutes);
}
