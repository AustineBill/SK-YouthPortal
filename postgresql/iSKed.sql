PGDMP  8    ;        	        |            iSKed    17.2    17.2 H    G           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            H           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            I           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            J           1262    16387    iSKed    DATABASE     �   CREATE DATABASE "iSKed" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "iSKed";
                     postgres    false                        3079    32779    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                        false            K           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                             false    2                       1255    32816    update_inventory_status()    FUNCTION     �  CREATE FUNCTION public.update_inventory_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Decrease the inventory quantity when equipment is borrowed
    IF TG_OP = 'INSERT' THEN
        UPDATE inventory
        SET quantity = quantity - NEW.quantity_borrowed
        WHERE id = NEW.equipment_id;

        -- Update the status to 'Out of Stock' if the quantity becomes zero
        UPDATE inventory
        SET status = 'Out of Stock'
        WHERE id = NEW.equipment_id AND quantity = 0;
    END IF;

    -- Increase the inventory quantity when equipment is returned
    IF TG_OP = 'UPDATE' AND NEW.returned_at IS NOT NULL THEN
        UPDATE inventory
        SET quantity = quantity + NEW.quantity_borrowed
        WHERE id = NEW.equipment_id;

        -- Update the status to 'Available' if the quantity is greater than zero
        UPDATE inventory
        SET status = 'Available'
        WHERE id = NEW.equipment_id AND quantity > 0;
    END IF;

    RETURN NEW;
END;
$$;
 0   DROP FUNCTION public.update_inventory_status();
       public               postgres    false            �            1259    16394 	   Schedules    TABLE     %   CREATE TABLE public."Schedules" (
);
    DROP TABLE public."Schedules";
       public         heap r       postgres    false            �            1259    32769    Users    TABLE     �   CREATE TABLE public."Users" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public."Users";
       public         heap r       postgres    false            �            1259    32768    Users_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Users_id_seq";
       public               postgres    false    220            L           0    0    Users_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
          public               postgres    false    219            �            1259    32940    contact    TABLE     �   CREATE TABLE public.contact (
    id integer NOT NULL,
    contact_number character varying(15) NOT NULL,
    location character varying(255) NOT NULL,
    gmail character varying(255) NOT NULL
);
    DROP TABLE public.contact;
       public         heap r       postgres    false            �            1259    32939    contact_id_seq    SEQUENCE     �   CREATE SEQUENCE public.contact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.contact_id_seq;
       public               postgres    false    235            M           0    0    contact_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.contact_id_seq OWNED BY public.contact.id;
          public               postgres    false    234            �            1259    32817 	   equipment    TABLE     �  CREATE TABLE public.equipment (
    id integer NOT NULL,
    user_id integer NOT NULL,
    reservation_id character varying(50) NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    reserved_equipment jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.equipment;
       public         heap r       postgres    false            �            1259    32824    equipment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.equipment_id_seq;
       public               postgres    false    221            N           0    0    equipment_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;
          public               postgres    false    222            �            1259    40971    home    TABLE     X  CREATE TABLE public.home (
    event_name character varying(255),
    event_description text,
    amenities text,
    event_image bytea,
    event_image_format character varying(10),
    CONSTRAINT home_event_image_format_check CHECK (((event_image_format)::text = ANY ((ARRAY['jpg'::character varying, 'png'::character varying])::text[])))
);
    DROP TABLE public.home;
       public         heap r       postgres    false            �            1259    32825 	   inventory    TABLE     D  CREATE TABLE public.inventory (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    quantity integer NOT NULL,
    specification text,
    status character varying(20) DEFAULT 'Available'::character varying NOT NULL,
    image_path text,
    CONSTRAINT inventory_quantity_check CHECK ((quantity >= 0))
);
    DROP TABLE public.inventory;
       public         heap r       postgres    false            �            1259    32832    inventory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.inventory_id_seq;
       public               postgres    false    223            O           0    0    inventory_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;
          public               postgres    false    224            �            1259    32833 	   schedules    TABLE     <  CREATE TABLE public.schedules (
    id integer NOT NULL,
    user_id integer NOT NULL,
    reservation_type character varying(50) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    time_slot character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.schedules;
       public         heap r       postgres    false            �            1259    32837    schedules_id_seq    SEQUENCE     �   CREATE SEQUENCE public.schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.schedules_id_seq;
       public               postgres    false    225            P           0    0    schedules_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.schedules_id_seq OWNED BY public.schedules.id;
          public               postgres    false    226            �            1259    32838 	   skcouncil    TABLE     �   CREATE TABLE public.skcouncil (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    age integer NOT NULL,
    "position" character varying(50) NOT NULL,
    description text
);
    DROP TABLE public.skcouncil;
       public         heap r       postgres    false            �            1259    32843    skcouncil_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skcouncil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.skcouncil_id_seq;
       public               postgres    false    227            Q           0    0    skcouncil_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.skcouncil_id_seq OWNED BY public.skcouncil.id;
          public               postgres    false    228            �            1259    32844    users    TABLE     �
  CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
    region character varying(100) NOT NULL,
    province character varying(100) NOT NULL,
    city character varying(100) NOT NULL,
    barangay character varying(100) NOT NULL,
    zone character varying(50),
    sex character varying(10) NOT NULL,
    age integer,
    birthday date NOT NULL,
    email_address character varying(255) NOT NULL,
    contact_number character varying(15) NOT NULL,
    civil_status character varying(20) NOT NULL,
    youth_age_group character varying(20) NOT NULL,
    work_status character varying(50) NOT NULL,
    educational_background character varying(50) NOT NULL,
    registered_sk_voter boolean NOT NULL,
    registered_national_voter boolean NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_age_check CHECK ((age >= 0)),
    CONSTRAINT users_civil_status_check CHECK (((civil_status)::text = ANY (ARRAY[('Single'::character varying)::text, ('Married'::character varying)::text, ('Widowed'::character varying)::text, ('Divorced'::character varying)::text, ('Separated'::character varying)::text, ('Annulled'::character varying)::text, ('Unknown'::character varying)::text, ('Live-in'::character varying)::text]))),
    CONSTRAINT users_educational_background_check CHECK (((educational_background)::text = ANY (ARRAY[('Elementary Level'::character varying)::text, ('Elementary Grad'::character varying)::text, ('High School Level'::character varying)::text, ('High School Grad'::character varying)::text, ('Vocational Grad'::character varying)::text, ('College Level'::character varying)::text, ('College Grad'::character varying)::text, ('Masters Level'::character varying)::text, ('Masters Grad'::character varying)::text]))),
    CONSTRAINT users_sex_check CHECK (((sex)::text = ANY (ARRAY[('Male'::character varying)::text, ('Female'::character varying)::text]))),
    CONSTRAINT users_work_status_check CHECK (((work_status)::text = ANY (ARRAY[('Employed'::character varying)::text, ('Unemployed'::character varying)::text, ('Self-Employed'::character varying)::text, ('Currently looking for a job'::character varying)::text, ('Not interested looking for a job'::character varying)::text]))),
    CONSTRAINT users_youth_age_group_check CHECK (((youth_age_group)::text = ANY (ARRAY[('Child Youth'::character varying)::text, ('Core Youth'::character varying)::text, ('Young Adult'::character varying)::text])))
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    32857    users_id_seq    SEQUENCE     |   CREATE SEQUENCE public.users_id_seq
    START WITH 1000
    INCREMENT BY 1
    MINVALUE 1000
    MAXVALUE 9999
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false            �            1259    32858    users_id_seq1    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.users_id_seq1;
       public               postgres    false    229            R           0    0    users_id_seq1    SEQUENCE OWNED BY     >   ALTER SEQUENCE public.users_id_seq1 OWNED BY public.users.id;
          public               postgres    false    231            �            1259    32859    website    TABLE     �   CREATE TABLE public.website (
    id integer NOT NULL,
    description text NOT NULL,
    mandate text NOT NULL,
    objectives text NOT NULL,
    mission text NOT NULL,
    vision text NOT NULL
);
    DROP TABLE public.website;
       public         heap r       postgres    false            �            1259    32864    website_id_seq    SEQUENCE     �   CREATE SEQUENCE public.website_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.website_id_seq;
       public               postgres    false    232            S           0    0    website_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.website_id_seq OWNED BY public.website.id;
          public               postgres    false    233            s           2604    32772    Users id    DEFAULT     h   ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);
 9   ALTER TABLE public."Users" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            �           2604    32943 
   contact id    DEFAULT     h   ALTER TABLE ONLY public.contact ALTER COLUMN id SET DEFAULT nextval('public.contact_id_seq'::regclass);
 9   ALTER TABLE public.contact ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    235    234    235            v           2604    32865    equipment id    DEFAULT     l   ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);
 ;   ALTER TABLE public.equipment ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221            y           2604    32866    inventory id    DEFAULT     l   ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);
 ;   ALTER TABLE public.inventory ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223            {           2604    32867    schedules id    DEFAULT     l   ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);
 ;   ALTER TABLE public.schedules ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225            }           2604    32868    skcouncil id    DEFAULT     l   ALTER TABLE ONLY public.skcouncil ALTER COLUMN id SET DEFAULT nextval('public.skcouncil_id_seq'::regclass);
 ;   ALTER TABLE public.skcouncil ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227            ~           2604    32869    users id    DEFAULT     e   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq1'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    231    229            �           2604    32870 
   website id    DEFAULT     h   ALTER TABLE ONLY public.website ALTER COLUMN id SET DEFAULT nextval('public.website_id_seq'::regclass);
 9   ALTER TABLE public.website ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    233    232            2          0    16394 	   Schedules 
   TABLE DATA           %   COPY public."Schedules"  FROM stdin;
    public               postgres    false    218   �^       4          0    32769    Users 
   TABLE DATA           J   COPY public."Users" (id, username, email, active, created_at) FROM stdin;
    public               postgres    false    220   �^       C          0    32940    contact 
   TABLE DATA           F   COPY public.contact (id, contact_number, location, gmail) FROM stdin;
    public               postgres    false    235   �^       5          0    32817 	   equipment 
   TABLE DATA           �   COPY public.equipment (id, user_id, reservation_id, start_date, end_date, reserved_equipment, created_at, updated_at) FROM stdin;
    public               postgres    false    221   1_       D          0    40971    home 
   TABLE DATA           i   COPY public.home (event_name, event_description, amenities, event_image, event_image_format) FROM stdin;
    public               postgres    false    236   �_       7          0    32825 	   inventory 
   TABLE DATA           Z   COPY public.inventory (id, name, quantity, specification, status, image_path) FROM stdin;
    public               postgres    false    223   �_       9          0    32833 	   schedules 
   TABLE DATA           o   COPY public.schedules (id, user_id, reservation_type, start_date, end_date, time_slot, created_at) FROM stdin;
    public               postgres    false    225   P`       ;          0    32838 	   skcouncil 
   TABLE DATA           K   COPY public.skcouncil (id, name, age, "position", description) FROM stdin;
    public               postgres    false    227   Za       =          0    32844    users 
   TABLE DATA           3  COPY public.users (id, username, password, firstname, lastname, region, province, city, barangay, zone, sex, age, birthday, email_address, contact_number, civil_status, youth_age_group, work_status, educational_background, registered_sk_voter, registered_national_voter, created_at, updated_at) FROM stdin;
    public               postgres    false    229   �a       @          0    32859    website 
   TABLE DATA           X   COPY public.website (id, description, mandate, objectives, mission, vision) FROM stdin;
    public               postgres    false    232   sb       T           0    0    Users_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Users_id_seq"', 1, false);
          public               postgres    false    219            U           0    0    contact_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.contact_id_seq', 1, true);
          public               postgres    false    234            V           0    0    equipment_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.equipment_id_seq', 8, true);
          public               postgres    false    222            W           0    0    inventory_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.inventory_id_seq', 1, true);
          public               postgres    false    224            X           0    0    schedules_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.schedules_id_seq', 37, true);
          public               postgres    false    226            Y           0    0    skcouncil_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.skcouncil_id_seq', 1, true);
          public               postgres    false    228            Z           0    0    users_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_id_seq', 1000, false);
          public               postgres    false    230            [           0    0    users_id_seq1    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq1', 1, true);
          public               postgres    false    231            \           0    0    website_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.website_id_seq', 1, true);
          public               postgres    false    233            �           2606    32778    Users Users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
       public                 postgres    false    220            �           2606    32947    contact contact_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.contact DROP CONSTRAINT contact_pkey;
       public                 postgres    false    235            �           2606    32872    equipment equipment_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.equipment DROP CONSTRAINT equipment_pkey;
       public                 postgres    false    221            �           2606    32874    inventory inventory_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.inventory DROP CONSTRAINT inventory_pkey;
       public                 postgres    false    223            �           2606    32876    schedules schedules_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.schedules DROP CONSTRAINT schedules_pkey;
       public                 postgres    false    225            �           2606    32878    skcouncil skcouncil_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.skcouncil
    ADD CONSTRAINT skcouncil_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.skcouncil DROP CONSTRAINT skcouncil_pkey;
       public                 postgres    false    227            �           2606    32880    users users_contact_number_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_contact_number_key UNIQUE (contact_number);
 H   ALTER TABLE ONLY public.users DROP CONSTRAINT users_contact_number_key;
       public                 postgres    false    229            �           2606    32882    users users_email_address_key 
   CONSTRAINT     a   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_address_key UNIQUE (email_address);
 G   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_address_key;
       public                 postgres    false    229            �           2606    32884    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    229            �           2606    32886    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public                 postgres    false    229            �           2606    32888    website website_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.website DROP CONSTRAINT website_pkey;
       public                 postgres    false    232            2      x������ � �      4      x������ � �      C   ?   x�3�405�O-.I-�Sp�L.-I��QIL/�L�L��+IL.q(ή�/-��K������� �b�      5   �   x����
�0D��W��m�]6�!W��
�`�Z"��� ����f�VXmV놽
SE@� 5 5R�� �\�|���`c��ڶ�|,�.O)wW[���>��a����O��A4�Le��E'&��adad�鏙i ԙ��1��Ef      D      x������ � �      7   L   x�3�t�H�,*�44�����O��O�V�L���/�t,K��IL�I��w,.N-�w-,�,�M�+ч��+�K����� f��      9   �   x���Gn�0е�����,���&��2���M�� ��?���n~�F։hb_�����8��縘)7�f���W _c�����Jt�V�`�4�ˉ�+�X����e�������HҬ4�$��p	��u~;=�.H�z:>p�Ϫ��qpuݎ��ZI��XA�og͍��%
�	D�.��F��'����$s2� ������iԫUQe�`��k,7�ɲI�j�/ZQuw�͇��V��V�' x�"�-      ;   9   x�3�����Sp�O�42�t�H�,�M���IML)V(�HU�Vp�/�K������� m!N      =   �   x�}���0E��W� m)�T'PcL\x�MJk������7�{s�cpX>�8�sQ�4o����[��VY�ù��0y�*g���ҋѤ1a�;�'�~	aeN7�s���V)-@�^e���Q��~��e!�N�.��6~B��Kx�����~�!�֢Fr�� !�\�,�K��:���D����g�$�FwF|      @   j   x�M�A
�0E�q����K�"8:���I����t��3����S�%������P�ʊ;Souu#,�	]E�`�!��������?t�L���fM�E!g��x�Z(7     