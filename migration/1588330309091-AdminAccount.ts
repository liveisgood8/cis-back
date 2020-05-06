import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminAccount1588329234411 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    let adminUserId = await queryRunner.query(`SELECT "id" FROM "user" where "login"='admin'`);
    if (!adminUserId.length) {
      await queryRunner.query('INSERT INTO "user"("login", "password", "name", "surname", ' +
        `"imageUrl") VALUES ('admin','6UMUsx8KtnKr70goutUv8A==', ` +
        `'Name','Surname','http://localhost:8080/profile-images/1.jpg')`);
      adminUserId = await queryRunner.query(`SELECT "id" FROM "user" where "login"='admin'`);
    }

    if (adminUserId.length && adminUserId[0].id > 0) {
      const id = adminUserId[0].id;
      await queryRunner.query(`DELETE FROM "user_permissions" WHERE "userId"=${id}`);
      await queryRunner.query(`INSERT INTO "user_permissions"("userId", "permissionId") VALUES (${id}, 1)`);
      await queryRunner.query(`INSERT INTO "user_permissions"("userId", "permissionId") VALUES (${id}, 2)`);
      await queryRunner.query(`INSERT INTO "user_permissions"("userId", "permissionId") VALUES (${id}, 3)`);
      await queryRunner.query(`INSERT INTO "user_permissions"("userId", "permissionId") VALUES (${id}, 4)`);
    } else {
      console.error(adminUserId);
      throw new Error('AdminUserId is not selected');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const adminUserId: number | undefined = await queryRunner.query(`SELECT "id" FROM "user" where "login"='admin'`);
    if (adminUserId) {
      await queryRunner.query(`DELETE FROM "user" WHERE "id"=${adminUserId}`);
      await queryRunner.query(`DELETE FROM "user_permissions" WHERE "userId"=${adminUserId}`);
    }
  }
}
