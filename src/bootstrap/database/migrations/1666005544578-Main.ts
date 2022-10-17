import { MigrationInterface, QueryRunner } from "typeorm";

export class Main1666005544578 implements MigrationInterface {
    name = 'Main1666005544578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "action" character varying NOT NULL, "subject" character varying NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("deleted_reason" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_by_id" integer, "last_updated_by_id" integer, "deleted_by_id" integer, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "backend_users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "locale" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "deleted_reason" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by_id" integer, "last_updated_by_id" integer, "deleted_by_id" integer, "role_id" integer, CONSTRAINT "PK_1f37124d7a7c5890f01afa4947b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f57217e50362fcaf1ef7e7c629" ON "backend_users" ("locale") `);
        await queryRunner.query(`CREATE TABLE "activities" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "request_type" character varying, "route" character varying, "before_update_action" text, "after_update_action" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "files" ("deleted_reason" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "path" character varying NOT NULL, "created_by_id" integer, "last_updated_by_id" integer, "deleted_by_id" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "languages" ("id" SERIAL NOT NULL, "locale" character varying NOT NULL, "label" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1c216b7894308fcecbee67c5d0" ON "languages" ("locale") `);
        await queryRunner.query(`CREATE TABLE "role_permission" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_19a94c31d4960ded0dcd0397759" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3d0a7155eafd75ddba5a701336" ON "role_permission" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e3a3ba47b7ca00fd23be4ebd6c" ON "role_permission" ("permission_id") `);
        await queryRunner.query(`CREATE TABLE "backend_user_permission" ("backend_user_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_4222421c38ff466ea922cd7225d" PRIMARY KEY ("backend_user_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_968052569d0fc7c1a0245ade30" ON "backend_user_permission" ("backend_user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a5d93edcb7f7e7de72b2c1c7c9" ON "backend_user_permission" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_4a4bff0f02e88cbdf770241ca8f" FOREIGN KEY ("created_by_id") REFERENCES "backend_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_89fe0a438f5b39254e996e28a98" FOREIGN KEY ("last_updated_by_id") REFERENCES "backend_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_7aab1939c84759090de748731a9" FOREIGN KEY ("deleted_by_id") REFERENCES "backend_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "backend_users" ADD CONSTRAINT "FK_8e88cd071dc09fb83604cc72cf3" FOREIGN KEY ("created_by_id") REFERENCES "backend_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "backend_users" ADD CONSTRAINT "FK_1c0888eefa50d4e738cf00a6964" FOREIGN KEY ("last_updated_by_id") REFERENCES "backend_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "backend_users" ADD CONSTRAINT "FK_31840fe30b53c60594f0c699731" FOREIGN KEY ("deleted_by_id") REFERENCES "backend_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "backend_users" ADD CONSTRAINT "FK_c9063bb0f3cef548374680de8b0" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_b82f1d8368dd5305ae7e7e664c2" FOREIGN KEY ("user_id") REFERENCES "backend_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_56bb34e9a86bf782fef80d8a868" FOREIGN KEY ("created_by_id") REFERENCES "backend_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_62fc7167eb939bb0bd04898a208" FOREIGN KEY ("last_updated_by_id") REFERENCES "backend_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_44b230dec73af3d1c595e1177d9" FOREIGN KEY ("deleted_by_id") REFERENCES "backend_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "backend_user_permission" ADD CONSTRAINT "FK_968052569d0fc7c1a0245ade30b" FOREIGN KEY ("backend_user_id") REFERENCES "backend_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "backend_user_permission" ADD CONSTRAINT "FK_a5d93edcb7f7e7de72b2c1c7c9e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "backend_user_permission" DROP CONSTRAINT "FK_a5d93edcb7f7e7de72b2c1c7c9e"`);
        await queryRunner.query(`ALTER TABLE "backend_user_permission" DROP CONSTRAINT "FK_968052569d0fc7c1a0245ade30b"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_44b230dec73af3d1c595e1177d9"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_62fc7167eb939bb0bd04898a208"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_56bb34e9a86bf782fef80d8a868"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_b82f1d8368dd5305ae7e7e664c2"`);
        await queryRunner.query(`ALTER TABLE "backend_users" DROP CONSTRAINT "FK_c9063bb0f3cef548374680de8b0"`);
        await queryRunner.query(`ALTER TABLE "backend_users" DROP CONSTRAINT "FK_31840fe30b53c60594f0c699731"`);
        await queryRunner.query(`ALTER TABLE "backend_users" DROP CONSTRAINT "FK_1c0888eefa50d4e738cf00a6964"`);
        await queryRunner.query(`ALTER TABLE "backend_users" DROP CONSTRAINT "FK_8e88cd071dc09fb83604cc72cf3"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_7aab1939c84759090de748731a9"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_89fe0a438f5b39254e996e28a98"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_4a4bff0f02e88cbdf770241ca8f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5d93edcb7f7e7de72b2c1c7c9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_968052569d0fc7c1a0245ade30"`);
        await queryRunner.query(`DROP TABLE "backend_user_permission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e3a3ba47b7ca00fd23be4ebd6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d0a7155eafd75ddba5a701336"`);
        await queryRunner.query(`DROP TABLE "role_permission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c216b7894308fcecbee67c5d0"`);
        await queryRunner.query(`DROP TABLE "languages"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f57217e50362fcaf1ef7e7c629"`);
        await queryRunner.query(`DROP TABLE "backend_users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
