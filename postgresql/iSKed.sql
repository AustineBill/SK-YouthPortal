PGDMP                        }            iSKed    17.2    17.2 a    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    57725    iSKed    DATABASE     �   CREATE DATABASE "iSKed" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "iSKed";
                     postgres    false                        3079    57726    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                        false            �           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                             false    2                        3079    57763 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            �           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    3            "           1255    57774    update_inventory_status()    FUNCTION     �  CREATE FUNCTION public.update_inventory_status() RETURNS trigger
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
       public               postgres    false            #           1255    66096 "   update_status_on_quantity_change()    FUNCTION     �   CREATE FUNCTION public.update_status_on_quantity_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.quantity = 0 THEN
    NEW.status := 'Out of Stock';
  ELSE
    NEW.status := 'Available';
  END IF;
  RETURN NEW;
END;
$$;
 9   DROP FUNCTION public.update_status_on_quantity_change();
       public               postgres    false            �            1259    57775    admins    TABLE     �   CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL
);
    DROP TABLE public.admins;
       public         heap r       postgres    false            �            1259    57778    admins_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.admins_id_seq;
       public               postgres    false    219            �           0    0    admins_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;
          public               postgres    false    220            �            1259    57779    contact    TABLE     �   CREATE TABLE public.contact (
    id integer NOT NULL,
    contact_number character varying(15) NOT NULL,
    location character varying(255) NOT NULL,
    gmail character varying(255) NOT NULL
);
    DROP TABLE public.contact;
       public         heap r       postgres    false            �            1259    57784    contact_id_seq    SEQUENCE     �   CREATE SEQUENCE public.contact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.contact_id_seq;
       public               postgres    false    221            �           0    0    contact_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.contact_id_seq OWNED BY public.contact.id;
          public               postgres    false    222            �            1259    57785 	   equipment    TABLE     #  CREATE TABLE public.equipment (
    id integer NOT NULL,
    user_id character varying(20) NOT NULL,
    reservation_id character varying(20) NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    reserved_equipment jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'pending'::character varying,
    is_archived boolean DEFAULT false
);
    DROP TABLE public.equipment;
       public         heap r       postgres    false            �            1259    57793    equipment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.equipment_id_seq;
       public               postgres    false    223            �           0    0    equipment_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;
          public               postgres    false    224            �            1259    57889    feedback    TABLE     �   CREATE TABLE public.feedback (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    rating integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.feedback;
       public         heap r       postgres    false            �            1259    57888    feedback_id_seq    SEQUENCE     �   CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.feedback_id_seq;
       public               postgres    false    243            �           0    0    feedback_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;
          public               postgres    false    242            �            1259    57794    home    TABLE     Z  CREATE TABLE public.home (
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
       public         heap r       postgres    false            �            1259    57801    home_id_seq    SEQUENCE     �   CREATE SEQUENCE public.home_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.home_id_seq;
       public               postgres    false    225            �           0    0    home_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.home_id_seq OWNED BY public.home.id;
          public               postgres    false    226            �            1259    57802 	   inventory    TABLE     _  CREATE TABLE public.inventory (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    specification character varying(255),
    status character varying(50) DEFAULT 'Available'::character varying,
    image character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.inventory;
       public         heap r       postgres    false            �            1259    57808    inventory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.inventory_id_seq;
       public               postgres    false    227            �           0    0    inventory_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;
          public               postgres    false    228            �            1259    57809    programs    TABLE     �   CREATE TABLE public.programs (
    id integer NOT NULL,
    program_name character varying(255) NOT NULL,
    heading character varying(255),
    description text,
    image_url character varying(255),
    program_type character varying(255)
);
    DROP TABLE public.programs;
       public         heap r       postgres    false            �            1259    57814    programs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.programs_id_seq;
       public               postgres    false    229            �           0    0    programs_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;
          public               postgres    false    230            �            1259    57815 	   schedules    TABLE     �  CREATE TABLE public.schedules (
    id integer NOT NULL,
    user_id character varying(20) NOT NULL,
    reservation_type character varying(50) NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    time_slot character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'Pending'::character varying,
    is_archived boolean DEFAULT false
);
    DROP TABLE public.schedules;
       public         heap r       postgres    false            �            1259    57820    schedules_id_seq    SEQUENCE     �   CREATE SEQUENCE public.schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.schedules_id_seq;
       public               postgres    false    231            �           0    0    schedules_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.schedules_id_seq OWNED BY public.schedules.id;
          public               postgres    false    232            �            1259    57821    skcouncil_id_seq    SEQUENCE     y   CREATE SEQUENCE public.skcouncil_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.skcouncil_id_seq;
       public               postgres    false            �            1259    57822 	   skcouncil    TABLE     �   CREATE TABLE public.skcouncil (
    id integer DEFAULT nextval('public.skcouncil_id_seq'::regclass) NOT NULL,
    image text
);
    DROP TABLE public.skcouncil;
       public         heap r       postgres    false    233            �            1259    57828    skcouncil_new_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skcouncil_new_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.skcouncil_new_id_seq;
       public               postgres    false    234            �           0    0    skcouncil_new_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.skcouncil_new_id_seq OWNED BY public.skcouncil.id;
          public               postgres    false    235            �            1259    57829 	   spotlight    TABLE     a   CREATE TABLE public.spotlight (
    id integer NOT NULL,
    frontimage text,
    images text
);
    DROP TABLE public.spotlight;
       public         heap r       postgres    false            �            1259    57834    spotlight_id_seq    SEQUENCE     �   CREATE SEQUENCE public.spotlight_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.spotlight_id_seq;
       public               postgres    false    236            �           0    0    spotlight_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.spotlight_id_seq OWNED BY public.spotlight.id;
          public               postgres    false    237            �            1259    57835    users    TABLE     �  CREATE TABLE public.users (
    id character varying(11) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    firstname character varying(255),
    lastname character varying(255),
    street character varying(255),
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'inactive'::character varying
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    57842    users_id_seq    SEQUENCE     |   CREATE SEQUENCE public.users_id_seq
    START WITH 1000
    INCREMENT BY 1
    MINVALUE 1000
    MAXVALUE 9999
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false            �            1259    57843    website    TABLE     �   CREATE TABLE public.website (
    id integer NOT NULL,
    description text NOT NULL,
    mandate text NOT NULL,
    objectives text NOT NULL,
    mission text NOT NULL,
    vision text NOT NULL,
    image_url text
);
    DROP TABLE public.website;
       public         heap r       postgres    false            �            1259    57848    website_id_seq    SEQUENCE     �   CREATE SEQUENCE public.website_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.website_id_seq;
       public               postgres    false    240            �           0    0    website_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.website_id_seq OWNED BY public.website.id;
          public               postgres    false    241            �           2604    57849 	   admins id    DEFAULT     f   ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);
 8   ALTER TABLE public.admins ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219            �           2604    57850 
   contact id    DEFAULT     h   ALTER TABLE ONLY public.contact ALTER COLUMN id SET DEFAULT nextval('public.contact_id_seq'::regclass);
 9   ALTER TABLE public.contact ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221            �           2604    57851    equipment id    DEFAULT     l   ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);
 ;   ALTER TABLE public.equipment ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223            �           2604    57892    feedback id    DEFAULT     j   ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);
 :   ALTER TABLE public.feedback ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    243    242    243            �           2604    57852    home id    DEFAULT     b   ALTER TABLE ONLY public.home ALTER COLUMN id SET DEFAULT nextval('public.home_id_seq'::regclass);
 6   ALTER TABLE public.home ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225            �           2604    57853    inventory id    DEFAULT     l   ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);
 ;   ALTER TABLE public.inventory ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227            �           2604    57854    programs id    DEFAULT     j   ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);
 :   ALTER TABLE public.programs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    229            �           2604    57855    schedules id    DEFAULT     l   ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);
 ;   ALTER TABLE public.schedules ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    232    231            �           2604    57856    spotlight id    DEFAULT     l   ALTER TABLE ONLY public.spotlight ALTER COLUMN id SET DEFAULT nextval('public.spotlight_id_seq'::regclass);
 ;   ALTER TABLE public.spotlight ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    237    236            �           2604    57857 
   website id    DEFAULT     h   ALTER TABLE ONLY public.website ALTER COLUMN id SET DEFAULT nextval('public.website_id_seq'::regclass);
 9   ALTER TABLE public.website ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    241    240            �          0    57775    admins 
   TABLE DATA           8   COPY public.admins (id, username, password) FROM stdin;
    public               postgres    false    219   �u       �          0    57779    contact 
   TABLE DATA           F   COPY public.contact (id, contact_number, location, gmail) FROM stdin;
    public               postgres    false    221   $v       �          0    57785 	   equipment 
   TABLE DATA           �   COPY public.equipment (id, user_id, reservation_id, start_date, end_date, reserved_equipment, created_at, updated_at, status, is_archived) FROM stdin;
    public               postgres    false    223   �v       �          0    57889    feedback 
   TABLE DATA           C   COPY public.feedback (id, user_id, rating, created_at) FROM stdin;
    public               postgres    false    243   �x       �          0    57794    home 
   TABLE DATA           �   COPY public.home (id, event_name, event_description, event_image, created_at, updated_at, quotes_name, quotes_description) FROM stdin;
    public               postgres    false    225    y       �          0    57802 	   inventory 
   TABLE DATA           a   COPY public.inventory (id, name, quantity, specification, status, image, created_at) FROM stdin;
    public               postgres    false    227   az       �          0    57809    programs 
   TABLE DATA           c   COPY public.programs (id, program_name, heading, description, image_url, program_type) FROM stdin;
    public               postgres    false    229   |       �          0    57815 	   schedules 
   TABLE DATA           �   COPY public.schedules (id, user_id, reservation_type, start_date, end_date, time_slot, created_at, status, is_archived) FROM stdin;
    public               postgres    false    231   �       �          0    57822 	   skcouncil 
   TABLE DATA           .   COPY public.skcouncil (id, image) FROM stdin;
    public               postgres    false    234   ̀       �          0    57829 	   spotlight 
   TABLE DATA           ;   COPY public.spotlight (id, frontimage, images) FROM stdin;
    public               postgres    false    236   ��       �          0    57835    users 
   TABLE DATA           ;  COPY public.users (id, username, password, firstname, lastname, street, province, city, barangay, zone, sex, age, birthday, email_address, contact_number, civil_status, youth_age_group, work_status, educational_background, registered_sk_voter, registered_national_voter, created_at, updated_at, status) FROM stdin;
    public               postgres    false    238   >�       �          0    57843    website 
   TABLE DATA           c   COPY public.website (id, description, mandate, objectives, mission, vision, image_url) FROM stdin;
    public               postgres    false    240   ��       �           0    0    admins_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.admins_id_seq', 1, true);
          public               postgres    false    220            �           0    0    contact_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.contact_id_seq', 1, true);
          public               postgres    false    222            �           0    0    equipment_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.equipment_id_seq', 11, true);
          public               postgres    false    224            �           0    0    feedback_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.feedback_id_seq', 15, true);
          public               postgres    false    242            �           0    0    home_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.home_id_seq', 12, true);
          public               postgres    false    226            �           0    0    inventory_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.inventory_id_seq', 42, true);
          public               postgres    false    228            �           0    0    programs_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.programs_id_seq', 23, true);
          public               postgres    false    230            �           0    0    schedules_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.schedules_id_seq', 103, true);
          public               postgres    false    232            �           0    0    skcouncil_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.skcouncil_id_seq', 10, true);
          public               postgres    false    233            �           0    0    skcouncil_new_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.skcouncil_new_id_seq', 17, true);
          public               postgres    false    235            �           0    0    spotlight_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.spotlight_id_seq', 10, true);
          public               postgres    false    237            �           0    0    users_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_id_seq', 1000, false);
          public               postgres    false    239            �           0    0    website_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.website_id_seq', 1, true);
          public               postgres    false    241            �           2606    57859    admins admins_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_pkey;
       public                 postgres    false    219            �           2606    57861    contact contact_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.contact DROP CONSTRAINT contact_pkey;
       public                 postgres    false    221            �           2606    57863    users email_address_unique 
   CONSTRAINT     ^   ALTER TABLE ONLY public.users
    ADD CONSTRAINT email_address_unique UNIQUE (email_address);
 D   ALTER TABLE ONLY public.users DROP CONSTRAINT email_address_unique;
       public                 postgres    false    238            �           2606    57865    equipment equipment_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.equipment DROP CONSTRAINT equipment_pkey;
       public                 postgres    false    223            �           2606    57897    feedback feedback_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.feedback DROP CONSTRAINT feedback_pkey;
       public                 postgres    false    243            �           2606    57867    home home_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.home
    ADD CONSTRAINT home_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.home DROP CONSTRAINT home_pkey;
       public                 postgres    false    225            �           2606    57869    inventory inventory_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.inventory DROP CONSTRAINT inventory_pkey;
       public                 postgres    false    227            �           2606    57871    programs programs_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.programs DROP CONSTRAINT programs_pkey;
       public                 postgres    false    229            �           2606    57873    schedules schedules_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.schedules DROP CONSTRAINT schedules_pkey;
       public                 postgres    false    231            �           2606    57875    skcouncil skcouncil_new_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.skcouncil
    ADD CONSTRAINT skcouncil_new_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.skcouncil DROP CONSTRAINT skcouncil_new_pkey;
       public                 postgres    false    234            �           2606    57877    spotlight spotlight_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.spotlight
    ADD CONSTRAINT spotlight_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.spotlight DROP CONSTRAINT spotlight_pkey;
       public                 postgres    false    236            �           2606    57879    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    238            �           2606    57881    website website_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.website DROP CONSTRAINT website_pkey;
       public                 postgres    false    240            �           2620    66097    inventory trigger_update_status    TRIGGER     �   CREATE TRIGGER trigger_update_status BEFORE INSERT OR UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_status_on_quantity_change();
 8   DROP TRIGGER trigger_update_status ON public.inventory;
       public               postgres    false    291    227            �           2606    57904     equipment equipment_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.equipment DROP CONSTRAINT equipment_user_id_fkey;
       public               postgres    false    4848    223    238            �           2606    57882    schedules schedule_user_id_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedule_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 I   ALTER TABLE ONLY public.schedules DROP CONSTRAINT schedule_user_id_fkey;
       public               postgres    false    4848    231    238            �      x�3�LL���342�b�=... 4+      �   S   x�3�442�515�5��4 q|3��Kt���Ĥ��b�̒J����̼Ԥ̜���ļ��Ĝ�d��������\�=... ~�;      �   �  x��UMo�0=o~��s7�g�u�	j�z a��@�B6B����Mֱ,��J>D~�轙7/ju�dmI�&r��g��� W(��֠���ϙ�h�{���.j/�;u�~	�~=l?�͸��f��#�����n�q��~^���5�RI(A���8��Ї��X�"F��6��e؛��������ލW��u����n�������Ry֍q�4��#����0���)���:��dt�L�ӫ�v	gu��y��F�*AI�ݞ�3��0z�,ߖ@���?8��9����%}ƅ_�������=�� cKP���Y����{mѹ�xCgR���ً3�u��Υ�bO���<{�b�o�ס�?�4�z�,M%(��Y�-kK�٤�i�_zNr�6��N+�l#e\V[�R��L-"x�}?�U��i^r���KPB��>�
f�:�w{���;���D7����,>�� ��S�[��>=1hHZ�
H��wMUU����      �   `   x�Eʱ�0�XT���Ё��M|����q䍗�w/\y��aj�6���nY)�IE�5���ʦ6j'4���ň�8��	�Y�o�(5�oy ��      �   Q  x�}�OO� ���SpS���nv:ffу�%�Y��
M�6?�T{�\H��x��0p�� c�oC0��~o��E����A����$i!Y��S~!�<ř`�}���	�Ά����`���u�mܜ�#0fsI2�I*899�2�3I��"B��9X횭v�U �Qp�{�e���$X�<%Y_=����q"��p��hP���>�`��i_	R�	�Z�ƨ��!�Dwj�[�*�um�a7j���}k�i��r��p4�g��I��һj�;��e�{�<0[K~XWY�[8^�ڙA�Wݶ�x_q��7)��q���|d#Rd�^���6i�$?�0��      �   �  x���An�0E��)f�.��IYڹE�M���@�Q�6ZTEFNN��b�ܺ�"Fp3ğ�>>Y�d���X%�iȧ�~���pu����{��9)��~Ļm�8Z<}�%�r�S�3�6�j�((���	J��d��nwjm�.!Lw��&��iQ�\�I�8k�jʪ��3��Y�hp0����0�h۔DH
kS�T,�!Uq.�o�_q�>9��u��~-P�U0E�*Rd1�o�F?����9���w��Y�i��&�	�~��J͠�O����a�Ά�>�N�'�E�цˢb��*+%���V��a
�6n��?�g+m�8I.�r�>H�j!e�	�~g���:�d>������G�E�����R�ee��uX�bGY�l��i
�ᨾ�G�HY��.�ȾY�� ��7      �   Y  x�eT�n�6}�~�|�z}i���q�����A�`��cS�JR�������	�%i��̹��f�G5��S+�߬���!��I~�k.�)I�����<�˽���vn�����]]]��|��u�4������o��G�3�fO�	=�l����0e��~�~.�D�����%%�ب�<S+I{/-�Q�vjp�\�>Zu����1D9oط�o1�zB9����v��������h�TP�M�Q���p����$�]���L��$��^.x��*�M:�s�W�([�d�A,�rF@Q�Q|��ķSdodK��=Ա�L�U�Y���~�O%��3�7njjo3�t-d���F��=ZY�6(x2Q�\*h	�G��i��V�Qc�e�-����U,ÞS��i+�!g�-4�bXZ7y������h|�`�Gw���� �u��u̢�����mXb��`9��
k�]'����p������-��}}����w��ϋ-�����u����c F�ęi]�K�4S<���>�/������O��x��܆���s��~�1=U0㋻pn�0L�D&դUb*͈hS�+��
���݂c���e��O�/�5���RV����&�o�|���)W�����d�C���4'}M�bw�����G�a���;��mH��5L�5�Zکf9���l��v2�&��6ݧ��"A�$�+�E�L	ބ|��Z���|�9a��yyV'!�1Lєy3��qH���U���@ۆ�E�"��� ��5݄;_��j�zY_�r���ΥW���ZtRآj�
L��l��;�٭���W7l��6�����?�      �   :  x���MN�0F��)z�F�cǱwpl� +�������6�"EU�����ո���3&fk�ס! �{���)�)���ߺ�C�l^C�%2������>|>?5/���D����,��C��sH
���jJITx��7�d8e�����TQ�X$��Q���3_]�F8H-c2��1dҊ���T���z����DԶU�WZ��_�F�;/��BT�4k�����*-�T�O�r� ��ժUܦb^��?\%X��XSi�ִR�,��T\���L!D�w�]��پl9�١�#�����m�/����      �   �   x�m��
�0��yk�������Er-B�R��c�.g��sf������lt��������A�����z����:T�J'6'��G,C	��I-H%�4��V$rO�cKxU[]%�&i�2.��7�ځ���xo��'$qY8�����$CP
p�,IȰ�&�x	^ƌ�/��|�      �   �   x�u�;�0���W8��}mѭ..�C�K��$����\Z��ypdҝ�b�L�h�!��Rqx���?}/�9m�1����~jL�W�y5���Ϟԋ>:> qс�h���`�l�U���%�A��P;9��(C��#����w\0�:v��yi_�      �   �  x���Ko�8��+XtK�cVSR��B���$&I�$�%��/СU53������F~t|2k֥��	F���3p�W�^��fґ)�y��rp�t
��*F����{�l%���ܧ�C9G�[�Y�	}��a���y}��I����(0V~�5'�K0�Y�Ӹ��"W1@��j�� �!Du�눀���8��?R���$PR�$��"0
c���$��-�"@+ژ��^�f��5ȫC��U(�5�P4�0國K%���N_�*$.�%��NuT��~a��hmMw-��m�x�Oˎզ���J�y��4&�����ت��3Ԧ�6�(�:���L����L���$|D�G$H�����@Rb�0�,�4��%"(j5(j@iA)�P�b\0�0�\o���7�$M��� Z~[�,��A2�:w��W����%�^1�N�������r>B�J�`Tq�~��s��&:��:b`U�X�{&�
�-����X��L,A�@�R���PrB$�M��Y�v�8��Mw���x�M��8��.�V�[�Dt���l�������v;�x�^�`��S�4� 1_t�*>�2�����#�~~��C?��� ����� i0���
L.�>M��	b��";Ύ��[v��pm�Or�k�nX��aƖ���t�^׆.�L9��?kN�G��ԡ�=�'��6<"��8�����IpF���'H����#���إҧ�M!�J���Bsw9�����ۂ�I�5��2�~����¿��k�@O��Y����E����c������m������'}9���*̷���Ud�%�,m$��ҧ��XTw�������h��Sr�^�&Yu�K�o���n��y�=���7��b���{�{ۜ8B�U{�p���K�&�&����@��'����t�����~��?�      �   Y  x��SˎA<'_�#HѬ�?XV �\����������q���h@�;�L6d9���!�y��������a ءx߄���Ǌ(�f�}���� � _�T��ٵ����=�s�6��IpdSlu��=
��Q���V�F�1�eV���!:�Cuȱ�Fҳ�-@��g�@z`��
y����
���}
X1����\��=�2pڀ�㨍�	H<zI�fFg��0Wv��8FPeze���}�P�~�Ǭ��ԁ���^�^�SQ����47�ĳ#&�<qP���b2p���1��s-jU��~�w$G�Q�I��f*�	�KY�p-Ԗ��R���XM�+Y��VG��C\�g�9����]߳u�!�`������Ң͎>C.��"$)�<^e6��d@��3ݚ�8c�<.*IGv�3$E�w0��`�r+�y\t8��E�	�����H��vO�լbU��W:�q��.�S��`}�BM�%<ݣ����ڼ����jg���fJZl���t�q�ዸ]rɴ��w�����8/�iVH�C���3��N�Q*��>������o�Տ��R���_?��rs��p~�%��[����]�����c�^�ڈ�     