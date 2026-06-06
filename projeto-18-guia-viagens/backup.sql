--
-- PostgreSQL database dump
--

\restrict evwxswOrPrxXQqtCuoB9pImSTedWMDFUqA4uESCSb6ZBeFBUZgcIwQxajvIseLh

-- Dumped from database version 17.10 (Homebrew)
-- Dumped by pg_dump version 17.10 (Homebrew)

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
-- Name: ExperienceType; Type: TYPE; Schema: public; Owner: nuno
--

CREATE TYPE public."ExperienceType" AS ENUM (
    'atividade',
    'restaurante',
    'outro'
);


ALTER TYPE public."ExperienceType" OWNER TO nuno;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: nuno
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO nuno;

--
-- Name: destinations; Type: TABLE; Schema: public; Owner: nuno
--

CREATE TABLE public.destinations (
    id integer NOT NULL,
    user_id integer NOT NULL,
    country character varying(100) NOT NULL,
    city character varying(100) NOT NULL,
    visit_date date NOT NULL,
    description text,
    rating integer,
    is_public boolean DEFAULT false NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.destinations OWNER TO nuno;

--
-- Name: destinations_id_seq; Type: SEQUENCE; Schema: public; Owner: nuno
--

CREATE SEQUENCE public.destinations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.destinations_id_seq OWNER TO nuno;

--
-- Name: destinations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nuno
--

ALTER SEQUENCE public.destinations_id_seq OWNED BY public.destinations.id;


--
-- Name: experiences; Type: TABLE; Schema: public; Owner: nuno
--

CREATE TABLE public.experiences (
    id integer NOT NULL,
    destination_id integer NOT NULL,
    title character varying(200) NOT NULL,
    type public."ExperienceType" NOT NULL,
    description text,
    rating integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.experiences OWNER TO nuno;

--
-- Name: experiences_id_seq; Type: SEQUENCE; Schema: public; Owner: nuno
--

CREATE SEQUENCE public.experiences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.experiences_id_seq OWNER TO nuno;

--
-- Name: experiences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nuno
--

ALTER SEQUENCE public.experiences_id_seq OWNED BY public.experiences.id;


--
-- Name: photos; Type: TABLE; Schema: public; Owner: nuno
--

CREATE TABLE public.photos (
    id integer NOT NULL,
    destination_id integer NOT NULL,
    filename character varying(255) NOT NULL,
    original_name character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.photos OWNER TO nuno;

--
-- Name: photos_id_seq; Type: SEQUENCE; Schema: public; Owner: nuno
--

CREATE SEQUENCE public.photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.photos_id_seq OWNER TO nuno;

--
-- Name: photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nuno
--

ALTER SEQUENCE public.photos_id_seq OWNED BY public.photos.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: nuno
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO nuno;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: nuno
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO nuno;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nuno
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: destinations id; Type: DEFAULT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public.destinations ALTER COLUMN id SET DEFAULT nextval('public.destinations_id_seq'::regclass);


--
-- Name: experiences id; Type: DEFAULT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public.experiences ALTER COLUMN id SET DEFAULT nextval('public.experiences_id_seq'::regclass);


--
-- Name: photos id; Type: DEFAULT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public.photos ALTER COLUMN id SET DEFAULT nextval('public.photos_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: nuno
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3f1904dc-3d6b-428a-91bd-f9d148f7fa66	9fe9ddfd05b78d5df3a3dfb16ebabd1476d7a02172f70ab60941ba9490581e93	2026-05-30 10:13:24.233571+01	20260528112034_init	\N	\N	2026-05-30 10:13:24.224505+01	1
\.


--
-- Data for Name: destinations; Type: TABLE DATA; Schema: public; Owner: nuno
--

COPY public.destinations (id, user_id, country, city, visit_date, description, rating, is_public, latitude, longitude, created_at, updated_at) FROM stdin;
2	1	Itália	roma	2026-05-20	Cidade muito bonita e com muita história.	4	t	\N	\N	2026-05-30 09:19:20.731	2026-05-30 09:19:20.731
1	1	Espanha	palma de maiorca	2026-05-05	Ilha muito bonita e agrádavel	5	t	\N	\N	2026-05-30 09:15:50.05	2026-05-30 09:21:54.127
\.


--
-- Data for Name: experiences; Type: TABLE DATA; Schema: public; Owner: nuno
--

COPY public.experiences (id, destination_id, title, type, description, rating, created_at) FROM stdin;
1	1	Visitar as Calles	atividade	Visitar calles na ilha uma das experiências mais interressantes.	5	2026-05-30 09:16:34.758
\.


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: nuno
--

COPY public.photos (id, destination_id, filename, original_name, created_at) FROM stdin;
1	1	1780132560950-69227577.jpg	Visitar-Palma-de-Maiorca-Roteiro.jpg	2026-05-30 09:16:00.958
2	2	1780132768696-829164556.jpg	hotel-best-roma.jpg	2026-05-30 09:19:28.702
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nuno
--

COPY public.users (id, name, email, password_hash, created_at) FROM stdin;
1	nuno	nuno@email	$2a$10$MVxhI2HPHGmUWs9cP5NWzOQy/we1Ord2jJlJM9O0lTwbXPmTV5RLG	2026-05-30 09:15:06.572
2	João Silva	joao@example.com	$2a$10$WwJK4izOLUnXmmLKAgO8zeFRhZJjxEb99l7kG7SMba4bdqJ8YiV6i	2026-06-06 10:06:23.731
\.


--
-- Name: destinations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nuno
--

SELECT pg_catalog.setval('public.destinations_id_seq', 2, true);


--
-- Name: experiences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nuno
--

SELECT pg_catalog.setval('public.experiences_id_seq', 1, true);


--
-- Name: photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nuno
--

SELECT pg_catalog.setval('public.photos_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nuno
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: destinations destinations_pkey; Type: CONSTRAINT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_pkey PRIMARY KEY (id);


--
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_destinations_public; Type: INDEX; Schema: public; Owner: nuno
--

CREATE INDEX idx_destinations_public ON public.destinations USING btree (is_public);


--
-- Name: idx_destinations_user; Type: INDEX; Schema: public; Owner: nuno
--

CREATE INDEX idx_destinations_user ON public.destinations USING btree (user_id);


--
-- Name: idx_experiences_destination; Type: INDEX; Schema: public; Owner: nuno
--

CREATE INDEX idx_experiences_destination ON public.experiences USING btree (destination_id);


--
-- Name: idx_photos_destination; Type: INDEX; Schema: public; Owner: nuno
--

CREATE INDEX idx_photos_destination ON public.photos USING btree (destination_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: nuno
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: destinations destinations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: experiences experiences_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: photos photos_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nuno
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict evwxswOrPrxXQqtCuoB9pImSTedWMDFUqA4uESCSb6ZBeFBUZgcIwQxajvIseLh

