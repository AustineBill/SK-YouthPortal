PGDMP      -                 }            iSKed    17.2    17.2 a    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
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
    comment text NOT NULL,
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
          public               postgres    false    228            �            1259    57809    programs    TABLE       CREATE TABLE public.programs (
    id integer NOT NULL,
    program_name character varying(255) NOT NULL,
    heading character varying(255),
    description text,
    amenities text[],
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
    public               postgres    false    219   :v       �          0    57779    contact 
   TABLE DATA           F   COPY public.contact (id, contact_number, location, gmail) FROM stdin;
    public               postgres    false    221   dv       �          0    57785 	   equipment 
   TABLE DATA           �   COPY public.equipment (id, user_id, reservation_id, start_date, end_date, reserved_equipment, created_at, updated_at, status, is_archived) FROM stdin;
    public               postgres    false    223   �v       �          0    57889    feedback 
   TABLE DATA           L   COPY public.feedback (id, user_id, rating, comment, created_at) FROM stdin;
    public               postgres    false    243   �w       �          0    57794    home 
   TABLE DATA           �   COPY public.home (id, event_name, event_description, event_image, created_at, updated_at, quotes_name, quotes_description) FROM stdin;
    public               postgres    false    225   -x       �          0    57802 	   inventory 
   TABLE DATA           a   COPY public.inventory (id, name, quantity, specification, status, image, created_at) FROM stdin;
    public               postgres    false    227   �x       �          0    57809    programs 
   TABLE DATA           n   COPY public.programs (id, program_name, heading, description, amenities, image_url, program_type) FROM stdin;
    public               postgres    false    229   �z       �          0    57815 	   schedules 
   TABLE DATA           �   COPY public.schedules (id, user_id, reservation_type, start_date, end_date, time_slot, created_at, status, is_archived) FROM stdin;
    public               postgres    false    231   �}       �          0    57822 	   skcouncil 
   TABLE DATA           .   COPY public.skcouncil (id, image) FROM stdin;
    public               postgres    false    234   ?       �          0    57829 	   spotlight 
   TABLE DATA           ;   COPY public.spotlight (id, frontimage, images) FROM stdin;
    public               postgres    false    236    �       �          0    57835    users 
   TABLE DATA           ;  COPY public.users (id, username, password, firstname, lastname, region, province, city, barangay, zone, sex, age, birthday, email_address, contact_number, civil_status, youth_age_group, work_status, educational_background, registered_sk_voter, registered_national_voter, created_at, updated_at, status) FROM stdin;
    public               postgres    false    238   e�       �          0    57843    website 
   TABLE DATA           c   COPY public.website (id, description, mandate, objectives, mission, vision, image_url) FROM stdin;
    public               postgres    false    240   ��       �           0    0    admins_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.admins_id_seq', 1, true);
          public               postgres    false    220            �           0    0    contact_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.contact_id_seq', 1, true);
          public               postgres    false    222            �           0    0    equipment_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.equipment_id_seq', 3, true);
          public               postgres    false    224            �           0    0    feedback_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.feedback_id_seq', 4, true);
          public               postgres    false    242            �           0    0    home_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.home_id_seq', 6, true);
          public               postgres    false    226            �           0    0    inventory_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.inventory_id_seq', 41, true);
          public               postgres    false    228            �           0    0    programs_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.programs_id_seq', 20, true);
          public               postgres    false    230            �           0    0    schedules_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.schedules_id_seq', 88, true);
          public               postgres    false    232            �           0    0    skcouncil_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.skcouncil_id_seq', 10, true);
          public               postgres    false    233            �           0    0    skcouncil_new_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.skcouncil_new_id_seq', 17, true);
          public               postgres    false    235            �           0    0    spotlight_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.spotlight_id_seq', 3, true);
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
       public               postgres    false    4848    231    238            �      x�3�LL���342�b�=... 4+      �   R   x�3�442�515�5��4 q|3��Kt���Ĥ�<�̒J����̼Ԥ̜���ļ��Ĝ�d��������\�=... b.�      �   �   x��αN�0�9~
�s��w��#���n$\a�*޽
%(#���ם>,��@��H����R�Pa�r	X�� �kƬ���i7&jGmr��\{7C�����CʟO���F�褪}�"s�kʛ6�^�)W��?\�+$�:�U�ܭr.� ڋ�	�����;<�u��jݥ����!�D+38��j�?VJ�3}�zn      �   w   x�M�1
�0@�Y>�r I�S�c��ܥ����f���:�?��p�z�X�
����Vq���q�c�>'I�Ğy-)��I,��߇)�A`�_8��і�=#iQ*��1Y���s"� v      �   �   x�}�A
�0E��)�M3��I�Sq��� ��b[Lk�o
�"��_���V��13�,�U�<��wc|��ehi*2���@:�Wd�)����*K��b�B�e��O�Sӵ��[�Ќ04g���~��G2���Q��"�2X\�����j%�|v�>7      �   �  x����n1�מ��KX�Կ���j�)���N����;i�����	X�"�7��Ϲ߱Y��3]�Q��������Y���u
�	�~� Y�`�O�Ex����-�����wΠ���v؛>]�!�^'�2���ݶ��9TC�ESQbR���TT�Դ��h9�`B��M;X�`��>�.O���N)�|?��L8?�o5�(�N6*�(��IQ������H�I�P�qvcsF��Ч�~����D}R��\��W��*�@�����AP�Ip���q{��e�J��%ab��*�p!d�1��G�[��%�\��e����pn�*3]�Ui��=o�2YIN�,�����!""��?��&�z>*.Bd���e�I���?�]0�ϭ�w6�R����Q}o��x�0̋�UQ/�`�      �   _  x�}TMo�6=k�����ɭG;MܢEa��@.��H��"U~�Z(���H��r�I�������A���¾��{��g6BC��w(�b{\��^�:�&b4{I�6�4/�K��KOi��vnie��~K{��\�{�����@sS�BV�e��ӓ�qO�]RE%6[yY��I"���8wu�z��2�a��FG���sT��St���V��1�k-g2x!�z9�3�(�(~�vO�������I�m�B��s��t����h��WzA�:�L9��
�
u��I��$�@V6�M�O&
�k�!�$�8�y�-ş4_���
(��2��X� &�A{Y'q�l��y�2І��NH'PT�C��E�M���++4@62�~�ژU�D�(�˰�h3�r jU�d�M���nu�z�ù�q=�=t���NI�M�wf�凧�u?<�>���=�ݯ�7ny��݄�.�s����6%�p0ો�o�4_��Z��NDt�������B���A����вF�⯠)�g���>Mj`o�ǖ0	��*���!G�VI<U�k�m9��W{��r�ѷ���v��!n�~�H�:.yG�6�L'�Jz���v�)�!>&f��/��a�$"���o�i�No�dv5��<�)�����*R0��:'�x����̚��P���f��$����%��4�W{��U�*��A��Wj��;�f\T��^��y9SzT��3{�C-:+l�4I��q��w|������['�>�>=�i���/06�M�-7��i{��0;��<�t_�|�|�:��_�ч��}���))��G��~G��qK)�؀�Lx����� ߞv7��_�e��r��v���p�      �   2  x��ӱn�0��</�u���}�ڥ[�]�Tj;5Em��vBJ!!d�N|�Z��� D�wl���Oo��7��Q��5��X�|���uS����6�mH�;�NU���g�x�Z�Լt_���8然qZ3%H�jY}�~��
�4��R<�xȯŉ4�V�8{�O�x�s핇��r<n��o��x�U+/xr�H�ʩ�Oڐ�;ų�'�ǹ�m�XN��m�A�C��ߏ�2c���l����2�C"��!X�C��!�~[�T�t1	���b�`���-n�9I��I���ng����̈      �   �   x�m��
�0��yk�������Er-B�R��c�.g��sf������lt��������A�����z����:T�J'6'��G,C	��I-H%�4��V$rO�cKxU[]%�&i�2.��7�ځ���xo��'$qY8�����$CP
p�,IȰ�&�x	^ƌ�/��|�      �   U   x�3����w,.N-����I-.��K�w-K�+)��*H�2Ĕu���ILO�+�Kǔ��@�up���7�jQbIf^:��=... �R8�      �   4  x���Is�0 ��+8�
ֆ@�j���q6�K��E����1���3�I=m���4����M�8e�E`Q�
P�6��Jf�e[�"�q-j�,�U0�H�"9Xɺ�Un�*l�G�@=7� c�!�&d&$�If5�gB�VXd r�1A�`�T�AQIc]�M��ʴ�d�G�T�4���&D&t�<�<�-��NDT.�Fmeo�ԅ���t��~8C�lp��?��I���]9/�v��mVN��ڶ���b���e�N�iv�Q{4�")R0q�b#PM����
�5����.RY*>�P��C��=�U�waR�7AЀĳ���c�h��}���A[7*�'zw�lӈ�\��Jv�����̹��'�#����Q�aʶ�����v��pj���7�hNT< �#R�?d��C�ON�)����	ٞ��յn�
}8�"F)�J��䔌�o�x��p�t���F����|˖���.���?6��].׍;�����W�?�N��j�ۿ�~QTOoo�m��U�gn@�Q�d!�"�N��U~Z�^�_1$      �   X  x��SˎA<'_�#HѬ�?XV �\����������q���h@�;�L6d9���!�y�������a ءx߄���Ǌ(�f�}���� � _�T��ٵ����=�s�6��IpdSlu��=
��Q���V�F�1�eV���!:�Cuȱ�Fҳ�-@��g�@z`��
y����
���}
X1����\��=�2pڀ�㨍�	H<zI�fFg��0Wv��8FPeze���}�P�~�Ǭ��ԁ���^�^�SQ����47�ĳ#&�<qP���b2p���1��s-jU��~�w$G�Q�I��f*�	�KY�p-Ԗ��R���XM�+Y��VG��C\�g�9����]߳u�!�`������Ң͎>C.��"$)�<^e6��d@��3ݚ�8c�<.*IGv�3$E�w0��`�r+�y\t8��E�	�����H��vO�լbU��W:�q��.�S��`}�BM�%<ݣ����ڼ����jg���fJZl���t�q�ዸ]rɴ��w�����8/�iVH�C���3��N�Q*��>������o�Տ��R���_?��rs��p~�%��[����]�����c�^�\OѴ     