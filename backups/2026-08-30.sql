SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict UbNL6ag6KWGfPsAspG8VUakubZjPHGh13fyKqRU0UcYOhGpM3WkmCCgH8Dvwdoj

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae', 'authenticated', 'authenticated', 'luuhoainam97@gmail.com', '$2a$10$S../YKrekaYkMY4IHoOVJ.ZsBhHOKjd7cg.wkRNOeZcphZJc42n7O', NULL, NULL, '73643e20140361086bd7f241e7f82ee6aa6fcc36d7e85913de7c6011', '2026-08-21 08:03:05.494523+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"sub": "0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae", "email": "luuhoainam97@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2026-08-21 08:03:05.459094+00', '2026-08-21 08:03:08.724044+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae', '0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae', '{"sub": "0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae", "email": "luuhoainam97@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-08-21 08:03:05.486545+00', '2026-08-21 08:03:05.486608+00', '2026-08-21 08:03:05.486608+00', '4941fd65-7cec-41f8-9a4b-8e5a1a114b07');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('8f02bd8d-e50b-4f6d-8959-74bf9d556d96', '0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae', 'confirmation_token', '73643e20140361086bd7f241e7f82ee6aa6fcc36d7e85913de7c6011', 'luuhoainam97@gmail.com', '2026-08-21 08:03:08.729486', '2026-08-21 08:03:08.729486');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."admins" ("email", "created_at") VALUES
	('luuhoainam97@gmail.com', '2026-08-20 07:18:25.850004+00');


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts" ("id", "slug", "title", "summary", "content", "cover_image", "tags", "status", "reading_minutes", "view_count", "published_at", "created_at", "updated_at") VALUES
	('3a90f500-09b4-4353-81c3-70c5c8352584', 'draft-example', 'Bài nháp mẫu', 'Bài này ở trạng thái draft, không được hiện ra ngoài public.', 'Nội dung nháp.
', NULL, '{meta}', 'draft', 1, 0, NULL, '2026-08-20 07:18:25.850004+00', '2026-08-20 07:18:25.850004+00'),
	('cbd2a06a-1e1d-48f3-9261-01cf520dd055', 'hello-world', 'Hello, world', 'Bài viết đầu tiên — dùng để kiểm tra pipeline render MDX.', '## Chào bạn

Đây là bài viết mẫu để test pipeline.

```go
func main() {
	fmt.Println("hello")
}
```

> Blockquote để kiểm tra style.

- item một
- item hai
', NULL, '{meta}', 'published', 2, 8, '2026-08-18 07:18:25.850004+00', '2026-08-20 07:18:25.850004+00', '2026-08-22 01:22:06.538195+00');


--
-- Data for Name: post_views; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."post_views" ("id", "post_id", "fingerprint", "viewed_on", "created_at") VALUES
	(1, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', 'ec4999f9f2707b8f2d30cec12c954fea3bd93173e4d4bbd564fec964194dcdae', '2026-08-20', '2026-08-20 07:47:05.087827+00'),
	(3, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', 'dbb55e709e21eef6f81c186a1068827f79e96606f91f89c0160e124961f004bd', '2026-08-20', '2026-08-20 07:49:37.077416+00'),
	(9, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', '60ecfa4f6e50a751a062dc8b24b04b5dec7f331b29979290460159f4425845e2', '2026-08-21', '2026-08-21 10:05:57.008252+00'),
	(12, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', '368af2daaab7c008393a5f40bca06a68f11fd409fa24ba34131a933380d8cc0d', '2026-08-21', '2026-08-21 10:08:23.378457+00'),
	(15, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', '7debaf85d9ac30e80897975168641673288dd511f335e11fdf123b1d78550045', '2026-08-21', '2026-08-21 10:11:02.997658+00'),
	(18, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', '5ddcfca2e2b18e7929c588b01b8da8ddac4ee1c8de4d2daed2cbdc84a174d501', '2026-08-21', '2026-08-21 10:21:17.331955+00'),
	(21, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', 'e61e38c2abe85b239776055377e3badb14a1bbd33447a3ec960d9c91dbead818', '2026-08-21', '2026-08-21 10:23:15.062484+00'),
	(24, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', 'd1c982e28f49c6a21f1abbd077074654f2d9218664d60c5c764372c1db05e0e5', '2026-08-22', '2026-08-22 01:22:06.538195+00');


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."projects" ("id", "slug", "title", "summary", "content", "cover_image", "tech", "repo_url", "live_url", "featured", "sort_order", "status", "created_at", "updated_at") VALUES
	('35063dac-ad5b-4790-85fb-23bd198198ed', 'sample-project', 'Sample Project', 'Một project mẫu để kiểm tra layout case study.', '### Problem

Mô tả vấn đề.

### Solution

Mô tả giải pháp.

### Architecture

Sơ đồ ở đây.

### Impact

- Giảm p99 từ 1.2s xuống 80ms
', NULL, '{Go,Postgres,Docker}', NULL, NULL, true, 1, 'published', '2026-08-20 07:18:25.850004+00', '2026-08-20 07:18:25.850004+00');


--
-- Data for Name: reactions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."subscribers" ("id", "email", "confirm_token", "confirmed_at", "created_at") VALUES
	('fc29b9d6-faf1-4600-8c88-852f8fb1d33f', 'test-20fe6412-5936-49e6-a251-f14687c74a84@example.com', '0e1acbc0-dd3e-469c-a20b-3493562de4ec', NULL, '2026-08-21 10:06:00.842944+00'),
	('ea649b67-64a7-4ba5-8267-80c41a241967', 'dup-c9c9e5f3-d100-4251-817b-026b2c6e2556@example.com', 'bb8fdeb6-9703-451c-9d5c-63f23a055b3c', NULL, '2026-08-21 10:06:02.267399+00'),
	('2d2fdc57-66d7-45f9-a912-33a009c639c3', 'test-dfff8512-d57e-4b6b-9fbb-3b2cecbffb2b@example.com', '538cad23-1263-4ff9-be09-b4fd6029cd33', NULL, '2026-08-21 10:08:26.089643+00'),
	('745a61c0-998f-40ef-8bf3-b8c736896d02', 'dup-172a75d0-c048-43a4-8f8b-0e809a5cc289@example.com', '2d129ab7-1ecc-4a43-846a-021e33261e5d', NULL, '2026-08-21 10:08:27.609596+00'),
	('6f908210-ef16-4729-827a-f6062b88624e', 'test-9d07460b-86f3-49e4-b78e-5bd1abe92c2f@example.com', '3a544a49-22bd-4d1b-9333-4403e6efe851', NULL, '2026-08-21 10:11:05.934234+00'),
	('f68e9d59-9413-4b69-98fc-36c48e360390', 'dup-5f0cd836-c814-4dc9-9b69-4bf307e7ca57@example.com', '2682bfc3-9f52-4ed5-b797-f7fb4b9f88d7', NULL, '2026-08-21 10:11:07.802585+00'),
	('524a09a5-f34b-49a1-91d2-c9bd8b160d83', 'test-be9a10c4-7619-46e6-8add-f33b11ac6dc5@example.com', '4b12cfca-9c73-4bde-a7c3-1a2c87bcc57f', NULL, '2026-08-21 10:21:20.717197+00'),
	('8c13fc71-8468-4ef4-9d45-ffe91bf3f416', 'dup-23d35612-376b-4108-adc3-45e45b7753ff@example.com', '9b18a2d1-1b06-48e5-b3f6-b61f9b0da6a7', NULL, '2026-08-21 10:21:22.325787+00'),
	('fbf63e7c-1d7b-446f-8478-86fe35fc92ba', 'test-671e8332-2cb5-466f-b5d5-6eebff1f5f63@example.com', 'cd8e0b7b-0a8c-4349-8a42-551814ff32c4', NULL, '2026-08-21 10:23:18.160583+00'),
	('4c1beea1-3624-4149-867c-a4be472c42ad', 'dup-a5a837ec-7bcc-40fd-8ef3-0f614a319d55@example.com', '8456468d-c91b-42f0-881f-0fbb9a40aa18', NULL, '2026-08-21 10:23:19.640237+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type", "versioning_status") VALUES
	('post-images', 'post-images', NULL, '2026-08-20 09:50:37.505367+00', '2026-08-20 09:50:37.505367+00', true, false, NULL, NULL, NULL, 'STANDARD', 'DISABLED'),
	('files', 'files', NULL, '2026-08-20 09:50:37.505367+00', '2026-08-20 09:50:37.505367+00', true, false, NULL, NULL, NULL, 'STANDARD', 'DISABLED');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: post_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."post_views_id_seq"', 24, true);


--
-- Name: reactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."reactions_id_seq"', 8, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict UbNL6ag6KWGfPsAspG8VUakubZjPHGh13fyKqRU0UcYOhGpM3WkmCCgH8Dvwdoj

RESET ALL;
