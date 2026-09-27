SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict SuhVzuZhF4yf16jOpPdSQvEHOl72Yifk7oSUq7PWjb9XJ0IgL3A14DUHkI0OZwX

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

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") VALUES
	('85cd5c0e-602a-4323-8385-d881aebc6870', '0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae', 'a30f74a6-7ba2-4015-9251-82857abcb950', 's256', '0ZFEVwoaS_8mYWqjSbbB6g9MvBr7pYOu7O9wpogqyVQ', 'email', '', '', '2026-09-03 07:24:43.634413+00', '2026-09-03 07:24:56.924017+00', 'email/signup', '2026-09-03 07:24:56.923954+00', NULL, NULL, NULL, NULL, false),
	('8d137783-91fa-49dc-868c-d9950ccf4aaa', '0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae', '40608a51-9dfc-40d4-b2d4-5ac83a6ad800', 's256', 'XboZ4GCQiEhSSPhSYHJ_KhCsiL_oetBUaBDAaOqpIMI', 'magiclink', '', '', '2026-09-04 08:27:38.109281+00', '2026-09-04 08:27:38.109281+00', 'magiclink', NULL, NULL, NULL, NULL, NULL, false),
	('ae79bce3-5737-4657-85df-02942b8619d8', '0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae', '485ccb23-9114-4703-99d9-5846b20ad6fd', 's256', 'nE6mf52q35qYB0LzzoesZsGNTMnZ4GAQBmVl4_BQdFI', 'magiclink', '', '', '2026-09-04 08:27:43.410177+00', '2026-09-04 08:28:04.404019+00', 'magiclink', '2026-09-04 08:28:04.40397+00', NULL, NULL, NULL, NULL, false),
	('c54d0b88-1135-489b-8c18-2888dcd5e347', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '38bf42c1-3c50-4ba2-ac12-c2a41466579c', 's256', 'EgtV7I-ylbcrHm9HjiRF__eVJU5Q8e79dqqr7pWIDLc', 'email', '', '', '2026-09-04 08:28:32.719999+00', '2026-09-04 08:28:32.719999+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('68b31f17-ca58-4591-a6ec-975bbd284445', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '5a56c14a-6d39-4cb3-9225-03aa0efd2927', 's256', 'QUOD-o30DSNX0Lt6PrwIePZQ3hBwwlBLE0e4TVvftYs', 'email', '', '', '2026-09-15 06:57:35.433619+00', '2026-09-15 07:01:16.665864+00', 'email/signup', '2026-09-15 07:01:16.665806+00', NULL, NULL, NULL, NULL, false),
	('d692b698-0c49-4a32-990b-dae7c01a7e79', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '7382c26c-1107-4fc8-87ef-42c7fd907646', 's256', 'PccXQgAVy-BsQhboHOQlL3ngg9oirS5hhfue83G1cKA', 'magiclink', '', '', '2026-09-15 07:16:30.327697+00', '2026-09-15 07:16:54.410239+00', 'magiclink', '2026-09-15 07:16:54.410197+00', NULL, NULL, NULL, NULL, false),
	('ddd85c30-e886-498b-a29e-44881a0b820c', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', 'd967d09d-76bf-4f0f-8acc-e848dcb31df5', 's256', '5cbvFP38tyrxTFW5nPvEG1aW-EFNNo5lwHw1aa78Rvs', 'magiclink', '', '', '2026-09-15 07:19:44.104553+00', '2026-09-15 07:19:44.104553+00', 'magiclink', NULL, NULL, NULL, NULL, NULL, false),
	('b4c3e101-5723-4920-8f39-9b66fdd8b8bd', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '5e3ee4f8-a8ce-4a02-8fcd-04b331a3c376', 's256', 'c1uJnFqH5JbjTEYHlXK5yrThJyIoa-J9bFyEVHPs1yY', 'magiclink', '', '', '2026-09-15 07:20:59.128492+00', '2026-09-15 07:20:59.128492+00', 'magiclink', NULL, NULL, NULL, NULL, NULL, false),
	('777ddb73-146d-480e-8208-c71ab1ece073', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', 'b571ff62-5368-4ca0-9f3a-fab70c6eec6f', 's256', '682Ww9SGtRgf-l6FiPGvkPS7Ucn-U3AOvXEIfiqB1I0', 'magiclink', '', '', '2026-09-15 07:23:06.185738+00', '2026-09-15 07:23:06.185738+00', 'magiclink', NULL, NULL, NULL, NULL, NULL, false),
	('5b15313e-6e52-431d-b77f-15850d8035a5', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '21352329-417e-417a-b839-667de55e8349', 's256', 'yH3Ab8rZUh9UprQeXCxTQjQ1p3FuzjMevX0o2zAeC6M', 'magiclink', '', '', '2026-09-15 07:23:41.375341+00', '2026-09-15 07:23:41.375341+00', 'magiclink', NULL, NULL, NULL, NULL, NULL, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae', 'authenticated', 'authenticated', 'luuhoainam97@gmail.com', '$2a$10$S../YKrekaYkMY4IHoOVJ.ZsBhHOKjd7cg.wkRNOeZcphZJc42n7O', '2026-09-03 07:24:56.915284+00', NULL, '', '2026-09-03 07:24:43.6477+00', '', '2026-09-04 08:27:38.133809+00', '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"sub": "0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae", "email": "luuhoainam97@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-08-21 08:03:05.459094+00', '2026-09-04 08:28:04.40081+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', 'authenticated', 'authenticated', 'nam.luuhoai.dev@gmail.com', '$2a$10$iVftHPw39ob3lAA0nqyaeut70CHfPvTvHlJIaiPZV5nCTSFHUCc6S', '2026-09-15 07:01:16.648826+00', NULL, '', '2026-09-15 06:57:35.460415+00', '', '2026-09-15 07:52:38.47565+00', '', '', NULL, '2026-09-15 07:53:02.278431+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "eeb64bd3-5904-4d1a-97f0-7c0654399935", "email": "nam.luuhoai.dev@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-09-04 08:28:32.696359+00', '2026-09-16 03:49:22.048597+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae', '0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae', '{"sub": "0e02abd2-8e32-4d7f-aa97-844ba2b0b7ae", "email": "luuhoainam97@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-08-21 08:03:05.486545+00', '2026-08-21 08:03:05.486608+00', '2026-08-21 08:03:05.486608+00', '4941fd65-7cec-41f8-9a4b-8e5a1a114b07'),
	('eeb64bd3-5904-4d1a-97f0-7c0654399935', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '{"sub": "eeb64bd3-5904-4d1a-97f0-7c0654399935", "email": "nam.luuhoai.dev@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-09-04 08:28:32.713518+00', '2026-09-04 08:28:32.713578+00', '2026-09-04 08:28:32.713578+00', '5fa2e571-e650-4574-b21a-13d8d7adc467');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('fc883413-2f73-4411-a577-c14e78579409', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '2026-09-15 07:42:43.463603+00', '2026-09-15 07:42:43.463603+00', NULL, 'aal1', NULL, NULL, 'node', '27.72.102.231', NULL, NULL, NULL, NULL, NULL),
	('b9fcdef3-b06d-49e7-aa4e-a8b695cedbcf', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '2026-09-15 07:45:57.960741+00', '2026-09-15 07:45:57.960741+00', NULL, 'aal1', NULL, NULL, 'node', '27.72.102.231', NULL, NULL, NULL, NULL, NULL),
	('b83067b1-e34b-417a-8836-12392c70492d', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '2026-09-15 07:53:02.278551+00', '2026-09-16 07:56:10.987805+00', NULL, 'aal1', NULL, '2026-09-16 07:56:10.987028', 'node', '27.72.102.231', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('fc883413-2f73-4411-a577-c14e78579409', '2026-09-15 07:42:43.518702+00', '2026-09-15 07:42:43.518702+00', 'magiclink', '7cd7cb36-c54b-4306-9a38-3542ee990d42'),
	('b9fcdef3-b06d-49e7-aa4e-a8b695cedbcf', '2026-09-15 07:45:57.966114+00', '2026-09-15 07:45:57.966114+00', 'magiclink', 'd715176f-ed55-4cbf-a847-ced88a9fc083'),
	('b83067b1-e34b-417a-8836-12392c70492d', '2026-09-15 07:53:02.282069+00', '2026-09-15 07:53:02.282069+00', 'magiclink', 'd9edf896-9ee2-431a-bb41-c48356f7ee69');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_recovery_code_sets; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_recovery_codes; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
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



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'ms3mbnzfsiex', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', false, '2026-09-15 07:42:43.495251+00', '2026-09-15 07:42:43.495251+00', NULL, 'fc883413-2f73-4411-a577-c14e78579409'),
	('00000000-0000-0000-0000-000000000000', 2, 'fuuar2c46ahf', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', false, '2026-09-15 07:45:57.962992+00', '2026-09-15 07:45:57.962992+00', NULL, 'b9fcdef3-b06d-49e7-aa4e-a8b695cedbcf'),
	('00000000-0000-0000-0000-000000000000', 3, 'russhivk55ry', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', true, '2026-09-15 07:53:02.280013+00', '2026-09-16 03:49:22.02048+00', NULL, 'b83067b1-e34b-417a-8836-12392c70492d'),
	('00000000-0000-0000-0000-000000000000', 4, 'b7dxadclg6mx', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', false, '2026-09-16 03:49:22.037421+00', '2026-09-16 03:49:22.037421+00', 'russhivk55ry', 'b83067b1-e34b-417a-8836-12392c70492d');


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
-- Data for Name: scim_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: scim_users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
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
	('nam.luuhoai.dev@gmail.com', '2026-09-15 07:50:17.308492+00');


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts" ("id", "slug", "title", "summary", "content", "cover_image", "tags", "status", "reading_minutes", "view_count", "published_at", "created_at", "updated_at") VALUES
	('3a90f500-09b4-4353-81c3-70c5c8352584', 'draft-example', 'Bài nháp mẫu', 'Bài này ở trạng thái draft, không được hiện ra ngoài public.', 'Nội dung nháp.
', NULL, '{meta}', 'draft', 1, 0, NULL, '2026-08-20 07:18:25.850004+00', '2026-08-20 07:18:25.850004+00'),
	('939294a1-2224-4808-8d63-4d76874eecd7', 'what-is-love', 'What is Love?', 'Love is a funny and mysterious thing.', 'C: i really think love is not based on effort. dont you think so?

L: then what is it based on?

C: you want cold water. i fan the cup a million times, then someone else walks by with ice. you want somthing from a person. maybe you have expections. i work with blood sweat and tears to reach to your expections. and then suddenly someone else just came by and has that thing you''ve been looking for. so, you go with them instead

![](https://geqlgmtoigxrbyryprey.supabase.co/storage/v1/object/public/post-images/642afd19-68b5-47e3-bdcf-2a360d152a3d.jpg)
', 'data:image/jpeg;base64,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', '{love}', 'published', 1, 1, '2026-09-15 08:05:16.513+00', '2026-09-15 08:05:16.692061+00', '2026-09-25 10:35:56.572987+00'),
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
', NULL, '{meta}', 'published', 2, 11, '2026-08-18 07:18:25.850004+00', '2026-08-20 07:18:25.850004+00', '2026-09-16 08:04:49.972625+00');


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
	(24, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', 'd1c982e28f49c6a21f1abbd077074654f2d9218664d60c5c764372c1db05e0e5', '2026-08-22', '2026-08-22 01:22:06.538195+00'),
	(25, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', 'e4114556ce76abfce5f0d5ec8cfde09972ff8b93c7af722a1a043a8834906196', '2026-09-03', '2026-09-03 07:21:16.451975+00'),
	(26, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', '0765ef87ef8c9d3e8468a006c2ccf5827819bd3c7a8e5ed08ab8e4f0ae2dd367', '2026-09-15', '2026-09-15 07:58:10.708287+00'),
	(29, 'cbd2a06a-1e1d-48f3-9261-01cf520dd055', '88aaf671dea8c133964809803983809bc4f82931eb0d0c009eb9b504ad8a4d78', '2026-09-16', '2026-09-16 08:04:49.972625+00'),
	(32, '939294a1-2224-4808-8d63-4d76874eecd7', 'd6be77783d5db403606fafc7041f2a68d00488939c53b405e442687941872fed', '2026-09-25', '2026-09-25 10:35:56.572987+00');


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
	('4c1beea1-3624-4149-867c-a4be472c42ad', 'dup-a5a837ec-7bcc-40fd-8ef3-0f614a319d55@example.com', '8456468d-c91b-42f0-881f-0fbb9a40aa18', NULL, '2026-08-21 10:23:19.640237+00'),
	('4ab2a82d-cda4-47f1-97c6-0c7806dc14a2', 'test-8e5d339f-e38f-460c-9185-1cf586926147@example.com', '093d77f6-2288-4ece-8868-dc6356cb9684', NULL, '2026-09-15 07:58:14.5338+00'),
	('dd62bdfb-a7e4-4212-97d3-a09060e07537', 'dup-d4df90f7-be1a-4a7e-afdf-214a218e5583@example.com', '07b61e2f-cf66-4f42-b858-e732300f95c8', NULL, '2026-09-15 07:58:15.622689+00'),
	('a05ed67d-8176-4a51-a2a7-696b0d6bb372', 'test-f87b8123-55b0-4872-b723-c410710a5fa8@example.com', '8e90e1c3-9b2b-432f-971b-d5ed9c51e10d', NULL, '2026-09-16 08:04:53.824012+00'),
	('0cc5ef4b-cb1b-4c54-a332-b9cc21beaa9b', 'dup-612007c1-2c12-44c7-bb16-a763a5ebda20@example.com', 'e359c3e0-c363-482f-ae15-e308eab8f9d0', NULL, '2026-09-16 08:04:55.725024+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type", "versioning_status", "lifecycle_configuration", "lifecycle_configuration_generation") VALUES
	('post-images', 'post-images', NULL, '2026-08-20 09:50:37.505367+00', '2026-08-20 09:50:37.505367+00', true, false, NULL, NULL, NULL, 'STANDARD', 'DISABLED', NULL, NULL),
	('files', 'files', NULL, '2026-08-20 09:50:37.505367+00', '2026-08-20 09:50:37.505367+00', true, false, NULL, NULL, NULL, 'STANDARD', 'DISABLED', NULL, NULL);


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "archived_at", "is_delete_marker", "is_versioned") VALUES
	('2a80efb0-dbb6-496b-833a-afeaefb6d3c1', 'post-images', '6e3f18d5-3c33-4a32-a0aa-9719c5dfb288.jpg', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '2026-09-15 08:07:48.70185+00', '2026-09-15 08:07:48.70185+00', '2026-09-15 08:07:48.70185+00', '{"eTag": "\"bae1b44049c040efbdcbfb6097a6c0fb\"", "size": 4456, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-09-15T08:07:49.000Z", "contentLength": 4456, "httpStatusCode": 200}', 'd7786e90-bd0f-4401-92c4-77f0e2524e3e', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '{}', NULL, false, false),
	('c69bd625-ece6-400e-84ab-8fe7385d39dc', 'post-images', '642afd19-68b5-47e3-bdcf-2a360d152a3d.jpg', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '2026-09-15 08:08:02.338681+00', '2026-09-15 08:08:02.338681+00', '2026-09-15 08:08:02.338681+00', '{"eTag": "\"bae1b44049c040efbdcbfb6097a6c0fb\"", "size": 4456, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-09-15T08:08:03.000Z", "contentLength": 4456, "httpStatusCode": 200}', 'c1913ebd-d87b-47d4-8dc6-48e55c0bd753', 'eeb64bd3-5904-4d1a-97f0-7c0654399935', '{}', NULL, false, false);


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 4, true);


--
-- Name: post_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."post_views_id_seq"', 32, true);


--
-- Name: reactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."reactions_id_seq"', 10, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict SuhVzuZhF4yf16jOpPdSQvEHOl72Yifk7oSUq7PWjb9XJ0IgL3A14DUHkI0OZwX

RESET ALL;
