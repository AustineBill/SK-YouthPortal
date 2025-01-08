PGDMP      2        	         }            iSKed    17.2    17.2 P    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16386    iSKed    DATABASE     �   CREATE DATABASE "iSKed" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "iSKed";
                     postgres    false                        3079    16411    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                        false            �           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                             false    2                        3079    33087 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            �           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    3                       1255    32927    update_inventory_status()    FUNCTION     �  CREATE FUNCTION public.update_inventory_status() RETURNS trigger
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
       public               postgres    false            �            1259    49439    contact    TABLE     �   CREATE TABLE public.contact (
    id integer NOT NULL,
    contact_number character varying(15) NOT NULL,
    location character varying(255) NOT NULL,
    gmail character varying(255) NOT NULL
);
    DROP TABLE public.contact;
       public         heap r       postgres    false            �            1259    49438    contact_id_seq    SEQUENCE     �   CREATE SEQUENCE public.contact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.contact_id_seq;
       public               postgres    false    232            �           0    0    contact_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.contact_id_seq OWNED BY public.contact.id;
          public               postgres    false    231            �            1259    33003 	   equipment    TABLE     �  CREATE TABLE public.equipment (
    id integer NOT NULL,
    user_id character varying(20) NOT NULL,
    reservation_id character varying(20) NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    reserved_equipment jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'pending'::character varying
);
    DROP TABLE public.equipment;
       public         heap r       postgres    false            �            1259    33002    equipment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.equipment_id_seq;
       public               postgres    false    225            �           0    0    equipment_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;
          public               postgres    false    224            �            1259    33042    home    TABLE     Z  CREATE TABLE public.home (
    id integer NOT NULL,
    event_name character varying(255) NOT NULL,
    event_description text NOT NULL,
    event_image text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    quotes_name character varying(255),
    quotes_description text
);
    DROP TABLE public.home;
       public         heap r       postgres    false            �            1259    33041    home_id_seq    SEQUENCE     �   CREATE SEQUENCE public.home_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.home_id_seq;
       public               postgres    false    227            �           0    0    home_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.home_id_seq OWNED BY public.home.id;
          public               postgres    false    226            �            1259    33061 	   inventory    TABLE     8  CREATE TABLE public.inventory (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    specification character varying(255),
    status character varying(50),
    image character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.inventory;
       public         heap r       postgres    false            �            1259    33060    inventory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.inventory_id_seq;
       public               postgres    false    229            �           0    0    inventory_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;
          public               postgres    false    228            �            1259    57672    programs    TABLE       CREATE TABLE public.programs (
    id integer NOT NULL,
    program_name character varying(255) NOT NULL,
    heading character varying(255),
    description text,
    amenities text[],
    image_url character varying(255),
    program_type character varying(255)
);
    DROP TABLE public.programs;
       public         heap r       postgres    false            �            1259    57671    programs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.programs_id_seq;
       public               postgres    false    234            �           0    0    programs_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;
          public               postgres    false    233            �            1259    24698 	   schedules    TABLE     �  CREATE TABLE public.schedules (
    id integer NOT NULL,
    user_id character varying(20) NOT NULL,
    reservation_type character varying(50) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    time_slot character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'Pending'::character varying
);
    DROP TABLE public.schedules;
       public         heap r       postgres    false            �            1259    24697    schedules_id_seq    SEQUENCE     �   CREATE SEQUENCE public.schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.schedules_id_seq;
       public               postgres    false    221            �           0    0    schedules_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.schedules_id_seq OWNED BY public.schedules.id;
          public               postgres    false    220            �            1259    57692    skcouncil_id_seq    SEQUENCE     y   CREATE SEQUENCE public.skcouncil_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.skcouncil_id_seq;
       public               postgres    false            �            1259    57684 	   skcouncil    TABLE     �   CREATE TABLE public.skcouncil (
    id integer DEFAULT nextval('public.skcouncil_id_seq'::regclass) NOT NULL,
    image text
);
    DROP TABLE public.skcouncil;
       public         heap r       postgres    false    237            �            1259    57683    skcouncil_new_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skcouncil_new_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.skcouncil_new_id_seq;
       public               postgres    false    236            �           0    0    skcouncil_new_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.skcouncil_new_id_seq OWNED BY public.skcouncil.id;
          public               postgres    false    235            �            1259    57695 	   spotlight    TABLE     a   CREATE TABLE public.spotlight (
    id integer NOT NULL,
    frontimage text,
    images text
);
    DROP TABLE public.spotlight;
       public         heap r       postgres    false            �            1259    57694    spotlight_id_seq    SEQUENCE     �   CREATE SEQUENCE public.spotlight_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.spotlight_id_seq;
       public               postgres    false    239            �           0    0    spotlight_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.spotlight_id_seq OWNED BY public.spotlight.id;
          public               postgres    false    238            �            1259    33133    users    TABLE     �  CREATE TABLE public.users (
    id character varying(11) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    firstname character varying(255),
    lastname character varying(255),
    region character varying(255),
    province character varying(255),
    city character varying(255),
    barangay character varying(255),
    zone character varying(10),
    sex character varying(20),
    age integer,
    birthday date,
    email_address character varying(255),
    contact_number character varying(255),
    civil_status character varying(50),
    youth_age_group character varying(255),
    work_status character varying(50),
    educational_background character varying(255),
    registered_sk_voter boolean,
    registered_national_voter boolean,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    24606    users_id_seq    SEQUENCE     |   CREATE SEQUENCE public.users_id_seq
    START WITH 1000
    INCREMENT BY 1
    MINVALUE 1000
    MAXVALUE 9999
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false            �            1259    24711    website    TABLE     �   CREATE TABLE public.website (
    id integer NOT NULL,
    description text NOT NULL,
    mandate text NOT NULL,
    objectives text NOT NULL,
    mission text NOT NULL,
    vision text NOT NULL,
    image_url text
);
    DROP TABLE public.website;
       public         heap r       postgres    false            �            1259    24710    website_id_seq    SEQUENCE     �   CREATE SEQUENCE public.website_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.website_id_seq;
       public               postgres    false    223            �           0    0    website_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.website_id_seq OWNED BY public.website.id;
          public               postgres    false    222            �           2604    49442 
   contact id    DEFAULT     h   ALTER TABLE ONLY public.contact ALTER COLUMN id SET DEFAULT nextval('public.contact_id_seq'::regclass);
 9   ALTER TABLE public.contact ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    232    231    232            �           2604    33006    equipment id    DEFAULT     l   ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);
 ;   ALTER TABLE public.equipment ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    224    225            �           2604    33045    home id    DEFAULT     b   ALTER TABLE ONLY public.home ALTER COLUMN id SET DEFAULT nextval('public.home_id_seq'::regclass);
 6   ALTER TABLE public.home ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    227    226    227            �           2604    33064    inventory id    DEFAULT     l   ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);
 ;   ALTER TABLE public.inventory ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    229    228    229            �           2604    57675    programs id    DEFAULT     j   ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);
 :   ALTER TABLE public.programs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    233    234    234            �           2604    24701    schedules id    DEFAULT     l   ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);
 ;   ALTER TABLE public.schedules ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    220    221            �           2604    57698    spotlight id    DEFAULT     l   ALTER TABLE ONLY public.spotlight ALTER COLUMN id SET DEFAULT nextval('public.spotlight_id_seq'::regclass);
 ;   ALTER TABLE public.spotlight ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    238    239    239            �           2604    24714 
   website id    DEFAULT     h   ALTER TABLE ONLY public.website ALTER COLUMN id SET DEFAULT nextval('public.website_id_seq'::regclass);
 9   ALTER TABLE public.website ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    223    223            ~          0    49439    contact 
   TABLE DATA           F   COPY public.contact (id, contact_number, location, gmail) FROM stdin;
    public               postgres    false    232   Pa       w          0    33003 	   equipment 
   TABLE DATA           �   COPY public.equipment (id, user_id, reservation_id, start_date, end_date, reserved_equipment, created_at, updated_at, status) FROM stdin;
    public               postgres    false    225   �a       y          0    33042    home 
   TABLE DATA           �   COPY public.home (id, event_name, event_description, event_image, created_at, updated_at, quotes_name, quotes_description) FROM stdin;
    public               postgres    false    227   �a       {          0    33061 	   inventory 
   TABLE DATA           a   COPY public.inventory (id, name, quantity, specification, status, image, created_at) FROM stdin;
    public               postgres    false    229   "b       �          0    57672    programs 
   TABLE DATA           n   COPY public.programs (id, program_name, heading, description, amenities, image_url, program_type) FROM stdin;
    public               postgres    false    234   �b       s          0    24698 	   schedules 
   TABLE DATA           w   COPY public.schedules (id, user_id, reservation_type, start_date, end_date, time_slot, created_at, status) FROM stdin;
    public               postgres    false    221   f       �          0    57684 	   skcouncil 
   TABLE DATA           .   COPY public.skcouncil (id, image) FROM stdin;
    public               postgres    false    236   �f       �          0    57695 	   spotlight 
   TABLE DATA           ;   COPY public.spotlight (id, frontimage, images) FROM stdin;
    public               postgres    false    239   Pg       |          0    33133    users 
   TABLE DATA           3  COPY public.users (id, username, password, firstname, lastname, region, province, city, barangay, zone, sex, age, birthday, email_address, contact_number, civil_status, youth_age_group, work_status, educational_background, registered_sk_voter, registered_national_voter, created_at, updated_at) FROM stdin;
    public               postgres    false    230   �g       u          0    24711    website 
   TABLE DATA           c   COPY public.website (id, description, mandate, objectives, mission, vision, image_url) FROM stdin;
    public               postgres    false    223   ui       �           0    0    contact_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.contact_id_seq', 1, true);
          public               postgres    false    231            �           0    0    equipment_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.equipment_id_seq', 31, true);
          public               postgres    false    224            �           0    0    home_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.home_id_seq', 5, true);
          public               postgres    false    226            �           0    0    inventory_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.inventory_id_seq', 32, true);
          public               postgres    false    228            �           0    0    programs_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.programs_id_seq', 14, true);
          public               postgres    false    233            �           0    0    schedules_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.schedules_id_seq', 76, true);
          public               postgres    false    220            �           0    0    skcouncil_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.skcouncil_id_seq', 10, true);
          public               postgres    false    237            �           0    0    skcouncil_new_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.skcouncil_new_id_seq', 17, true);
          public               postgres    false    235            �           0    0    spotlight_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.spotlight_id_seq', 1, true);
          public               postgres    false    238            �           0    0    users_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_id_seq', 1000, false);
          public               postgres    false    219            �           0    0    website_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.website_id_seq', 1, true);
          public               postgres    false    222            �           2606    49446    contact contact_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.contact DROP CONSTRAINT contact_pkey;
       public                 postgres    false    232            �           2606    57709    users email_address_unique 
   CONSTRAINT     ^   ALTER TABLE ONLY public.users
    ADD CONSTRAINT email_address_unique UNIQUE (email_address);
 D   ALTER TABLE ONLY public.users DROP CONSTRAINT email_address_unique;
       public                 postgres    false    230            �           2606    33012    equipment equipment_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.equipment DROP CONSTRAINT equipment_pkey;
       public                 postgres    false    225            �           2606    33049    home home_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.home
    ADD CONSTRAINT home_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.home DROP CONSTRAINT home_pkey;
       public                 postgres    false    227            �           2606    33068    inventory inventory_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.inventory DROP CONSTRAINT inventory_pkey;
       public                 postgres    false    229            �           2606    57679    programs programs_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.programs DROP CONSTRAINT programs_pkey;
       public                 postgres    false    234            �           2606    24704    schedules schedules_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.schedules DROP CONSTRAINT schedules_pkey;
       public                 postgres    false    221            �           2606    57691    skcouncil skcouncil_new_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.skcouncil
    ADD CONSTRAINT skcouncil_new_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.skcouncil DROP CONSTRAINT skcouncil_new_pkey;
       public                 postgres    false    236            �           2606    57702    spotlight spotlight_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.spotlight
    ADD CONSTRAINT spotlight_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.spotlight DROP CONSTRAINT spotlight_pkey;
       public                 postgres    false    239            �           2606    57648    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    230            �           2606    24718    website website_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.website DROP CONSTRAINT website_pkey;
       public                 postgres    false    223            �           2606    57660    schedules schedule_user_id_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedule_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 I   ALTER TABLE ONLY public.schedules DROP CONSTRAINT schedule_user_id_fkey;
       public               postgres    false    221    230    4822            ~   G   x�3�442�515�5��4 q|3��Kt���Ĥ����L�̒J�Ԋ�܂�T��������\�=... \�1      w      x������ � �      y   N   x�3�,�A�����TN}����}ײԼ�b(o��U��id`d�k`�k`�`d`elaeb�gdbnl�G&���b���� Xm�      {   �   x�}��
�@ 뽯��{{�t"�V�N�=�h�}��)�V�=��N�{�r��nw�bq���Z�c���J�5���bK^t�ֆ	��Ɛ�U+��
�ɑr4���J�`��)6����#6)nS�;�X����m���5C      �   -  x�}T�n�6=���>�����1�̀�C�\�TI�1�R�t[��y���c��j{�>u����,&t7�`���X�A#��%;����K�'�D�ɁS��X��9���4��A��~iawN|�&K{��ȗ�	=����턲�u�������r�0�ivK�Y�،����z�Rtf﯎����I��#���H9G1H���'���|�fBYg2Y<����O�uF*J9r����D,�i��,�6�ڃU���EÁn���Mf!	֗�Ѡ�.S�FBM��������@��7�m�i �k͚���-8�y�ضN5���tv�7��	t,� �a���	4N��9J��pن�D<�L����X�+��V���� ��2�*hcV8�y�Y^�%�6$p�VE���d��ѯ*\+�Qϵ��� ���{}������닎3����݇���UӨ���}��f&�ݭFtA_#3$��ͯ.i��PU�s��TB�Fj�j 48a��$���!H�(@���=`��8tF"B�O��u��'��I,��|l� b��ᐯ"{�t����T��v���_�ʳ���m����q������Y����;M�N&���bO��4Q�5>%�3��۲a��,���o�ib�Jo�d�Oy�S7�P-�E$��:'�x����Ě��:-��y3�8	�J~+��'M�U��L�W�	#�!01z3�����B�J�e�ZP�3�'�>��آ�@��T��i���W��+�׿+��}��EM�Otx4@�8~(�>���_�W~��hV>?�wJ�z���������n���P�      s   w   x�]���0C��W��פ�udaca`��B��i��$O������h����\ڽ�Bkk�Q�	��GL����5J'bMVt������������XĻ_�s뺰l�݇�=��P(&
      �   �   x�m��
�0��yk�������Er-B�R��c�.g��sf������lt��������A�����z����:T�J'6'��G,C	��I-H%�4��V$rO�cKxU[]%�&i�2.��7�ځ���xo��'$qY8�����$CP
p�,IȰ�&�x	^ƌ�/��|�      �   8   x�3��w,.N-����I-.��K�w���ILO��*Hǔ��@�:
��A
�b���� ��"�      |   �  x���K��0 ���Wp���`NZ)�&�6�4MՋK�@j �Q5��k6��H��!s���f�6q�/���N��1�֭�N�F���B����t�2M�����u[;I����ψ}�h�(!�%�Kt�ዼR��"��)���:�Ҧ�ή�6����9�]5F�z;(��%��A�8FDzD�l׊
N�@{&]_�z��2{"�7oa��̝��O�dd�q��.���1�W��.��/8� ���雕y��gEӘK#sPD#x,�=WB���	�ɳ2D��Cv�;�IS�3~%�U���kY�	�l����2�BŅ������!���JhT���Ϲ<�����4���J�ܿyG��na3/����}��@߈�T߽������b�O�V�v��In�sXlc��kQ�̡=<݌��_W���,b�!	Q�WB�O�d2�
o��      u   �   x���MJ�@�םS�B�x�A����A:���%�j��3����Fğ��ރ�}����3�Q�����bM�%D�#��[Z�A���R����"ٶ\���P��ݲ
 p�T�Ec��&Ht��������fV%�s�"�ip{Т��a��o���%s�~���������>�J��C� ����.Sx��k��F�}F     