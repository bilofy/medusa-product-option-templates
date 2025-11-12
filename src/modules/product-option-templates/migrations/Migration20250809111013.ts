import { Migration } from '@mikro-orm/migrations';

export class Migration20250809111013 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_option_template" ("id" text not null, "product_type_id" text not null, "title" text not null, "values" jsonb not null default '[]', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_option_template_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_option_template_deleted_at" ON "product_option_template" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_option_template" cascade;`);
  }

}
