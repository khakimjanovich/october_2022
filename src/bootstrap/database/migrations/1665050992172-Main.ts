import { MigrationInterface, QueryRunner } from "typeorm";

export class Main1665050992172 implements MigrationInterface {
    name = 'Main1665050992172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "action" character varying NOT NULL, "subject" character varying NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "locale" character varying NOT NULL, "deleted_reason" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_by_id" integer, "last_updated_by_id" integer, "deleted_by_id" integer, "role_id" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48e51c1d92ff2b53b0542f8f8f" ON "users" ("locale") `);
        await queryRunner.query(`CREATE TABLE "activities" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "request_type" character varying, "route" character varying, "entity" character varying, "entity_id" integer, "before_update_action" text, "after_update_action" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "languages" ("id" SERIAL NOT NULL, "locale" character varying NOT NULL, "label" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1c216b7894308fcecbee67c5d0" ON "languages" ("locale") `);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, "created_by_email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permission" ("rolesId" integer NOT NULL, "permissionsId" integer NOT NULL, CONSTRAINT "PK_35229662dc8257bd347c362ca7f" PRIMARY KEY ("rolesId", "permissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4415da0ee208fbaab336fb4f82" ON "role_permission" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a66c28dfa49e57c784aae8325" ON "role_permission" ("permissionsId") `);
        await queryRunner.query(`CREATE TABLE "user_permission" ("usersId" integer NOT NULL, "permissionsId" integer NOT NULL, CONSTRAINT "PK_8d4fd91e624b6243a0058577e13" PRIMARY KEY ("usersId", "permissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6dcc82467ba2369698fc9d6f3e" ON "user_permission" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7559dd0d03791137cae4d8529f" ON "user_permission" ("permissionsId") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_1bbd34899b8e74ef2a7f3212806" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c9b69267c4a02c39008fcf94d70" FOREIGN KEY ("last_updated_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_4241f21b9bb35e82a6217af1aad" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_b82f1d8368dd5305ae7e7e664c2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_4415da0ee208fbaab336fb4f820" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_6a66c28dfa49e57c784aae83252" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_permission" ADD CONSTRAINT "FK_6dcc82467ba2369698fc9d6f3ee" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_permission" ADD CONSTRAINT "FK_7559dd0d03791137cae4d8529f4" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_permission" DROP CONSTRAINT "FK_7559dd0d03791137cae4d8529f4"`);
        await queryRunner.query(`ALTER TABLE "user_permission" DROP CONSTRAINT "FK_6dcc82467ba2369698fc9d6f3ee"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_6a66c28dfa49e57c784aae83252"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_4415da0ee208fbaab336fb4f820"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_b82f1d8368dd5305ae7e7e664c2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_4241f21b9bb35e82a6217af1aad"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c9b69267c4a02c39008fcf94d70"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_1bbd34899b8e74ef2a7f3212806"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7559dd0d03791137cae4d8529f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6dcc82467ba2369698fc9d6f3e"`);
        await queryRunner.query(`DROP TABLE "user_permission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a66c28dfa49e57c784aae8325"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4415da0ee208fbaab336fb4f82"`);
        await queryRunner.query(`DROP TABLE "role_permission"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c216b7894308fcecbee67c5d0"`);
        await queryRunner.query(`DROP TABLE "languages"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48e51c1d92ff2b53b0542f8f8f"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
