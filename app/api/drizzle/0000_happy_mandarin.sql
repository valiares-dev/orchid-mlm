CREATE TYPE "public"."account_status" AS ENUM('INACTIVE', 'ACTIVE_DEDUCTION', 'ACTIVE_FULL');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('MEMBER', 'ADMIN', 'DEV');--> statement-breakpoint
CREATE TYPE "public"."commission_status" AS ENUM('PENDING', 'CREDITED', 'REVERSED');--> statement-breakpoint
CREATE TYPE "public"."commission_type" AS ENUM('REFERRAL_BONUS', 'LEVEL_BONUS', 'DEBT_DEDUCTION');--> statement-breakpoint
CREATE TYPE "public"."debt_status" AS ENUM('OUTSTANDING', 'PAID');--> statement-breakpoint
CREATE TYPE "public"."order_acquisition" AS ENUM('PURCHASED', 'CREDIT');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('PENDING', 'PAID', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."code_status" AS ENUM('AVAILABLE', 'USED', 'REVOKED');--> statement-breakpoint
CREATE TYPE "public"."code_type" AS ENUM('SYSTEM', 'DEDUCTION', 'FULL');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'PAID');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"phone" text,
	"role" "user_role" DEFAULT 'MEMBER' NOT NULL,
	"account_status" "account_status" DEFAULT 'INACTIVE' NOT NULL,
	"sponsor_id" uuid,
	"terms_accepted_at" timestamp with time zone NOT NULL,
	"activated_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "commissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"beneficiary_id" uuid NOT NULL,
	"source_user_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"type" "commission_type" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"level" smallint,
	"debt_id" uuid,
	"deducted_from_id" uuid,
	"status" "commission_status" DEFAULT 'PENDING' NOT NULL,
	"credited_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "commission_level_check" CHECK ("commissions"."level" BETWEEN 0 AND 5)
);
--> statement-breakpoint
CREATE TABLE "debt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"debtor_id" uuid NOT NULL,
	"creditor_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"principal" numeric(12, 2) NOT NULL,
	"amount_paid" numeric(12, 2) DEFAULT '0' NOT NULL,
	"deduction_rate" smallint DEFAULT 20 NOT NULL,
	"status" "debt_status" DEFAULT 'OUTSTANDING' NOT NULL,
	"settled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "debt_debtor_id_unique" UNIQUE("debtor_id"),
	CONSTRAINT "debt_principal_positive" CHECK ("debt"."principal" > 0),
	CONSTRAINT "debt_amount_paid_range" CHECK ("debt"."amount_paid" >= 0 AND "debt"."amount_paid" <= "debt"."principal"),
	CONSTRAINT "debt_rate_range" CHECK ("debt"."deduction_rate" BETWEEN 1 AND 100),
	CONSTRAINT "debt_not_self" CHECK ("debt"."debtor_id" <> "debt"."creditor_id"),
	CONSTRAINT "debt_status_matches_paid" CHECK (("debt"."status" = 'PAID') = ("debt"."amount_paid" = "debt"."principal"))
);
--> statement-breakpoint
CREATE TABLE "network_closure" (
	"ancestor_id" uuid NOT NULL,
	"descendant_id" uuid NOT NULL,
	"depth" smallint NOT NULL,
	CONSTRAINT "network_closure_ancestor_id_descendant_id_pk" PRIMARY KEY("ancestor_id","descendant_id"),
	CONSTRAINT "depth_check" CHECK ("network_closure"."depth" >= 0 AND "network_closure"."depth" <= 5)
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"buyer_id" uuid NOT NULL,
	"referrer_id" uuid NOT NULL,
	"package_id" uuid NOT NULL,
	"acquisition" "order_acquisition" DEFAULT 'PURCHASED' NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" "order_status" DEFAULT 'PENDING' NOT NULL,
	"confirmed_by" uuid,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "package_items" (
	"package_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" smallint DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(12, 2) NOT NULL,
	"is_starter" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "packages_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(12, 2) NOT NULL,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "referral_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"type" "code_type" NOT NULL,
	"issued_by" uuid,
	"package_id" uuid,
	"status" "code_status" DEFAULT 'AVAILABLE' NOT NULL,
	"used_by" uuid,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "referral_codes_code_unique" UNIQUE("code"),
	CONSTRAINT "referral_codes_used_by_unique" UNIQUE("used_by")
);
--> statement-breakpoint
CREATE TABLE "withdrawal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" "withdrawal_status" DEFAULT 'PENDING' NOT NULL,
	"processed_by" uuid,
	"processed_at" timestamp with time zone,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "direct_rates" (
	"from_sale" smallint PRIMARY KEY NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "level_rates" (
	"level" smallint PRIMARY KEY NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "level_check" CHECK ("level_rates"."level" BETWEEN 0 AND 5)
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_sponsor_id_users_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_beneficiary_id_users_id_fk" FOREIGN KEY ("beneficiary_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_source_user_id_users_id_fk" FOREIGN KEY ("source_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_debt_id_debt_id_fk" FOREIGN KEY ("debt_id") REFERENCES "public"."debt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_deducted_from_id_commissions_id_fk" FOREIGN KEY ("deducted_from_id") REFERENCES "public"."commissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "debt" ADD CONSTRAINT "debt_debtor_id_users_id_fk" FOREIGN KEY ("debtor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "debt" ADD CONSTRAINT "debt_creditor_id_users_id_fk" FOREIGN KEY ("creditor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "debt" ADD CONSTRAINT "debt_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_closure" ADD CONSTRAINT "network_closure_ancestor_id_users_id_fk" FOREIGN KEY ("ancestor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "network_closure" ADD CONSTRAINT "network_closure_descendant_id_users_id_fk" FOREIGN KEY ("descendant_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_confirmed_by_users_id_fk" FOREIGN KEY ("confirmed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_items" ADD CONSTRAINT "package_items_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_items" ADD CONSTRAINT "package_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_issued_by_users_id_fk" FOREIGN KEY ("issued_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_used_by_users_id_fk" FOREIGN KEY ("used_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawal" ADD CONSTRAINT "withdrawal_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawal" ADD CONSTRAINT "withdrawal_processed_by_users_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "network_closure_descendant_idx" ON "network_closure" USING btree ("descendant_id");