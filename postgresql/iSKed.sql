PGDMP  6                     }            iSKed    17.2    17.2 G    z           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            {           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            |           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            }           1262    16386    iSKed    DATABASE     �   CREATE DATABASE "iSKed" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "iSKed";
                     postgres    false                        3079    16411    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                        false            ~           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                             false    2                        3079    33087 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false                       0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    3                       1255    32927    update_inventory_status()    FUNCTION     �  CREATE FUNCTION public.update_inventory_status() RETURNS trigger
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
       public               postgres    false    234            �           0    0    contact_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.contact_id_seq OWNED BY public.contact.id;
          public               postgres    false    233            �            1259    33003 	   equipment    TABLE     �  CREATE TABLE public.equipment (
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
       public               postgres    false    227            �           0    0    equipment_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;
          public               postgres    false    226            �            1259    33042    home    TABLE     W  CREATE TABLE public.home (
    id integer NOT NULL,
    event_name character varying(255) NOT NULL,
    event_description text NOT NULL,
    amenities text,
    event_image text,
    event_image_format character varying(10),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
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
       public               postgres    false    229            �           0    0    home_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.home_id_seq OWNED BY public.home.id;
          public               postgres    false    228            �            1259    33061 	   inventory    TABLE     8  CREATE TABLE public.inventory (
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
       public               postgres    false    231            �           0    0    inventory_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;
          public               postgres    false    230            �            1259    57672    programs    TABLE       CREATE TABLE public.programs (
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
       public               postgres    false    236            �           0    0    programs_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;
          public               postgres    false    235            �            1259    24698 	   schedules    TABLE     �  CREATE TABLE public.schedules (
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
          public               postgres    false    220            �            1259    24720 	   skcouncil    TABLE     �   CREATE TABLE public.skcouncil (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    age integer NOT NULL,
    "position" character varying(50) NOT NULL,
    description text,
    image text
);
    DROP TABLE public.skcouncil;
       public         heap r       postgres    false            �            1259    24719    skcouncil_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skcouncil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.skcouncil_id_seq;
       public               postgres    false    225            �           0    0    skcouncil_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.skcouncil_id_seq OWNED BY public.skcouncil.id;
          public               postgres    false    224            �            1259    33133    users    TABLE     �  CREATE TABLE public.users (
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
       public               postgres    false    233    234    234            �           2604    33006    equipment id    DEFAULT     l   ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);
 ;   ALTER TABLE public.equipment ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    227    227            �           2604    33045    home id    DEFAULT     b   ALTER TABLE ONLY public.home ALTER COLUMN id SET DEFAULT nextval('public.home_id_seq'::regclass);
 6   ALTER TABLE public.home ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    229    228    229            �           2604    33064    inventory id    DEFAULT     l   ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);
 ;   ALTER TABLE public.inventory ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    231    231            �           2604    57675    programs id    DEFAULT     j   ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);
 :   ALTER TABLE public.programs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    235    236    236            �           2604    24701    schedules id    DEFAULT     l   ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);
 ;   ALTER TABLE public.schedules ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    221    221            �           2604    24723    skcouncil id    DEFAULT     l   ALTER TABLE ONLY public.skcouncil ALTER COLUMN id SET DEFAULT nextval('public.skcouncil_id_seq'::regclass);
 ;   ALTER TABLE public.skcouncil ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    225    225            �           2604    24714 
   website id    DEFAULT     h   ALTER TABLE ONLY public.website ALTER COLUMN id SET DEFAULT nextval('public.website_id_seq'::regclass);
 9   ALTER TABLE public.website ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    222    223            u          0    49439    contact 
   TABLE DATA           F   COPY public.contact (id, contact_number, location, gmail) FROM stdin;
    public               postgres    false    234   /X       n          0    33003 	   equipment 
   TABLE DATA           �   COPY public.equipment (id, user_id, reservation_id, start_date, end_date, reserved_equipment, created_at, updated_at, status) FROM stdin;
    public               postgres    false    227   �X       p          0    33042    home 
   TABLE DATA           �   COPY public.home (id, event_name, event_description, amenities, event_image, event_image_format, created_at, updated_at) FROM stdin;
    public               postgres    false    229   �X       r          0    33061 	   inventory 
   TABLE DATA           a   COPY public.inventory (id, name, quantity, specification, status, image, created_at) FROM stdin;
    public               postgres    false    231   �       w          0    57672    programs 
   TABLE DATA           n   COPY public.programs (id, program_name, heading, description, amenities, image_url, program_type) FROM stdin;
    public               postgres    false    236   ��       h          0    24698 	   schedules 
   TABLE DATA           w   COPY public.schedules (id, user_id, reservation_type, start_date, end_date, time_slot, created_at, status) FROM stdin;
    public               postgres    false    221   ��       l          0    24720 	   skcouncil 
   TABLE DATA           R   COPY public.skcouncil (id, name, age, "position", description, image) FROM stdin;
    public               postgres    false    225   C�       s          0    33133    users 
   TABLE DATA           3  COPY public.users (id, username, password, firstname, lastname, region, province, city, barangay, zone, sex, age, birthday, email_address, contact_number, civil_status, youth_age_group, work_status, educational_background, registered_sk_voter, registered_national_voter, created_at, updated_at) FROM stdin;
    public               postgres    false    232   ��       j          0    24711    website 
   TABLE DATA           c   COPY public.website (id, description, mandate, objectives, mission, vision, image_url) FROM stdin;
    public               postgres    false    223   $�       �           0    0    contact_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.contact_id_seq', 1, true);
          public               postgres    false    233            �           0    0    equipment_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.equipment_id_seq', 31, true);
          public               postgres    false    226            �           0    0    home_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.home_id_seq', 2, true);
          public               postgres    false    228            �           0    0    inventory_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.inventory_id_seq', 32, true);
          public               postgres    false    230            �           0    0    programs_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.programs_id_seq', 2, true);
          public               postgres    false    235            �           0    0    schedules_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.schedules_id_seq', 76, true);
          public               postgres    false    220            �           0    0    skcouncil_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.skcouncil_id_seq', 3, true);
          public               postgres    false    224            �           0    0    users_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_id_seq', 1000, false);
          public               postgres    false    219            �           0    0    website_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.website_id_seq', 1, true);
          public               postgres    false    222            �           2606    49446    contact contact_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.contact DROP CONSTRAINT contact_pkey;
       public                 postgres    false    234            �           2606    33012    equipment equipment_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.equipment DROP CONSTRAINT equipment_pkey;
       public                 postgres    false    227            �           2606    33049    home home_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.home
    ADD CONSTRAINT home_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.home DROP CONSTRAINT home_pkey;
       public                 postgres    false    229            �           2606    33068    inventory inventory_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.inventory DROP CONSTRAINT inventory_pkey;
       public                 postgres    false    231            �           2606    57679    programs programs_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.programs DROP CONSTRAINT programs_pkey;
       public                 postgres    false    236            �           2606    24704    schedules schedules_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.schedules DROP CONSTRAINT schedules_pkey;
       public                 postgres    false    221            �           2606    24727    skcouncil skcouncil_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.skcouncil
    ADD CONSTRAINT skcouncil_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.skcouncil DROP CONSTRAINT skcouncil_pkey;
       public                 postgres    false    225            �           2606    57648    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    232            �           2606    24718    website website_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.website DROP CONSTRAINT website_pkey;
       public                 postgres    false    223            �           2606    57660    schedules schedule_user_id_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedule_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 I   ALTER TABLE ONLY public.schedules DROP CONSTRAINT schedule_user_id_fkey;
       public               postgres    false    221    4815    232            u   G   x�3�442�515�5��4 q|3��Kt���Ĥ����L�̒J�Ԋ�܂�T��������\�=... \�1      n      x������ � �      p      x�캷��ʶ�i>E���=$� Z+Zk��o���}�I���Q�*RE"֚�Ȁ����������⿞�W�}t�d���G����o�8�?��2����l�?&�l�1ˊ����	k0]��0�՜��'��[E�����C�c�옅�,�ۮ���*'3H�����`�L�wg���Q�[�c�[
�&��J�Fbg�����-�>����{@�e��nC2,�>C$���#�г8�5�ϐk��c����D��I�K>�Q�ܫ&K	̐am�d>�c�m�2��؟����*������g�>߯X2���{0@DI�&����e�1���8����'iQ`j�u8{+İV�d�rΰ��`ޞ߁l�=���}Ŗ)Y�f��*��a��޻��_��D�0�w������b<9���U8Y�Y��B��y�����D���e��t|G��A�6+��8O�EM���N��:��:%L��y�S�#�F���K$�d}��iA�uăX���ln����jɘ�-�I�9wg�nP�06䷒�8��q��p��ۇ��S\��H��́X�YM���<x1��$%G�=�ݡ�.̊�`��AD!ytF��!��P>6۹r�+�%�C��%@㭊j�E�'Ylf�y�� �<Z��z��#� pp�@�&�a�N��&��\�Fxf�H�M�B�0,q/�@��'��O#O�DND���kN\f8��N���Iw���@�x��{uv�7`���L�E�i>��d�*0���Sᶘ`�|��-����nM[0M��B���sD�d�=�ܑ	[��=�����xk��#�|���!0�`O�1���Ky8kd�5�_L�����|�q2��2��3��^��転���nOL4�d�@����"�d��B1? Z�h�Av��1�ld1@wZ�P��C_'KB*��g�z@�lG��n�`:�(���N ^�p���܉�ELvg��{��d��;��������qĒ�8��b�|}�}@���=�Y�:�Hv��H:Mqk:yz�x�n�P������d�0m��)Bm�좎o���B����u駻5������0tܨ[���M�ٌN:O�c>���h l��ɽ1�2;͡%N��r$3�l�1h<�#v�����@-zP�A9
��"�ֽA�l��:)���n	��N�%tS`�sׯ�B�5�PU�z��KK0nx�s�9��FWz�ƴ:�{�6G��$���Ğh��oh�������J��L&\XډF ?Cc~� �����#o���t�xb�]�J|l�7H��/�7终�D�k�
��Et _���W.23�G̢��5O`�O�O�%Z:y��h/t�[��؛Fm%�J����]�s0�)0W�'�nUE"�,P��QaX��N�@_T(�3U	Q-���Jw�����gޘTF�f��g,:S��TzKQ��t>�V}'��?�v��8��+�d���q%�'�y_9�a����k�\�fȓ�ӿ�{��v/�pf��eߋ����u�xc�1�b�Ņ�~�Ɏ&�����."A��&��H��Eu�~n2ze��D�8��aݴQ��w��{D��,�kь�̔�Řҡ�h�p��X�k1�CN���Bi�h�c�6�-w^�j�>`W_�+}�m��=w*���G��c��u'�"��CLg��'��U���>�i�=l<����T�8%ʮ;-�`A��LJ��Fɋ�4��(���'�Π��N����S�������9 �%����;���t�"�+�]*ӴG;�Z{%=�F�뾴0$��T��������d��򫻴	�\E�N�m��G�$7�:�������̄w-}�:y��� ����>"��]ɏ�`ŉU1�/�W(��Z}��/]ã ����K�B��N0�0i�/9=+)��r�3��w�	����<8P1�M�)���J��ܿY�+8��d�R�[0�mY�<,��އp�3Q�q���:�y(���x����c%#PH�3��0�*̑�yrs�g�0�[��M�ש"�u9��.c3��E�ŠJ�-l�Ma,\ix0�0#��+�s�ve?����p֒��r�l�#>�ux^��9�E?y0����#���cҚ���ѯ(�'N�ڢFd�p�rf��g�L�(��P��ŕ\����P���2�����d�B��L���}Mb!�y'�>���տ���&0�TV�%:����ai���t��9^�q���}�{�B>H0�4���R_h��R�X �U2���n8�����	�x��[� {.Ó�:���)�05��Y�Jr��衯s��k�hZ-�c(�D��B�2
�W|xA�n.���&�S��tp�8Er.��t�],��0�V�״c��w8��`%5�%8�fA��wt��椷��y
�� ���YU
N���Ev1�	����f5 SN^&�Q�KǰR�Mpy��UL�w�#
�����減x����5��P�VEt�Q5�
���`$#*O��B�J&�"���
�Nt���_��+��us�������םW����}�w���5:�$O�b+�,��K ��㐡O��!�Շf�'_���	l{n�á{�s��|T]��@=�X��$-ד�����$���~�Z��^����!":�/����٫_�j�26�U����Y
=���좲����+~���*<��p���6X��A�r��;���ÄT��� ��u�9b����V6mљ�4�ߺt������q	������
�P��1������Q���>�_j���j��@yz�*��O�doF��K�
%��Bu��X���_�[ͱ���ʂ�T�����H��.4�ͬzʲ�fh�/۔��<Ȅl3�����O�l��,��D�I `��A���+��<[-e�P�G�|{>�M�u�&}��Hn��ә�.G��&��B?���+��C,��Kq� ��l��C<sXtA^�=��#i�w���
ɫ�Gr����g6ʽ�K��uƣc��� r�Rp���)�3��dk��Ի	B�_@����� ���1@�f�-��1"�Y6���rK* W�S���*4��7�a^@:I��ֻA�t=Ѣ,��J�(Z_��]�3��u���L����ٺ�g�i������V"g��L�/;�(ܿh�80݂R��/�څ�A!*��6v��.s�M󦃀��f�jEX_����֌��|s��(���/�w���� 1ŀ�S����'W?�&�Fw>�a�Y���pvL�D���L,�Ι�ED����l-�O�x�Ι�R��҃R~ŧ"�9�6�K�`χ���A�� U>^}z���wa�$��~��K����oC=��x���a-�@� �%��K���ғ��A�T�-z
�+q�`7�
�^i�н�{.m{&w�aԬg��_�7E-�}S��Y�p..~ܢo�҇�j�v�i�:�&d�����;Y�8+�P巊�}�L*b���%5[(S��O,��H����&J;sC��~Z��!ؤ�� 0M�X9b��k,؃�c�������KT�*�2�~Bic��M�:��u"_��NM(�S������*��ּE�t,�m�t�E
7G�3���"}��'"x��M1�}�!o�oMW������Ͳ�H��-w&��������r�$�,�?��ɭ̓OD��H�v��Ԫ��D����d�h�$n�w�/~�;�Y��'=�Rwm x�{�ri�AqnoC}4L�ۥ�~2�Sx`|����������9�	�\��@ج!�����?oy�� �B̩dP=����������~�s8���d0Fץq�X���������E	ʹ7˛%d��.ȃ2�FQ
L|ޥQb��`����o^pF�?��ƀ�1�H2����D�G��FD�=P
c?��̿mj�|�x��'<����l:�}�������Gz��؊��ee�B�^a.݊'q�    �16e��~����S��BQ��= w�b��%�H_�r���:����h��f*��*6уo�xO���1"�@1z�q��c�;� �����k�1���^�.�(k�˕����r�;H��E�MP|��P!Q&�R?�o�a���^�
VXͲ?��s�s�ݞ2��%�����#��6��Ɨ.���ag�n�e��-i�:	��n"�$h)��噂b�+��ȷ����1l�4�Ѭ��	:�ܤA0�wf�)9��.�\��ͳ�iPz�J�3<p�X�6\�,GA0�6���,u���9�0��7|'WϚ��R�K��4�󷯑,�]���!sxy	��x��=9��w� �d(ϑ�:��2�)��fw<��}��`o3�K����=z��B��hjg��=�E	t������Ʉ��]jm�8�"�' �[b;�!+�0�Agn�%m�>4���� �v�w	�j)B؈bB�E�.v		Ʉ����7����t��"�*с���2+$c�xא3ů�0!���l�/k�˺�2�Z �ZLN�D��L��f�j���uNv)��;�BW`��5�tI}��X�}<08o=��uo,�� +���0�N!+\�1���`��^�6�>(��V,��8�C��n�0�5�7u������8��d���L��'f�r�@m�p�;7G�u������)%�,
z:!E�=/h$��`�Ċ����eD���nm�R���c����	@�#q�|`��y��B9�������t��Ue���xˣo���˫���)�f9,�7��^q�rl�kCCo���ڳ7V-.�B������dG��m�!���J'ш~g�1��3��~�sȰ@{�	�\#.pr�����ɥ��@+pJ0�k �Y�u���ɰ�+���3��M�OS�+���2�I��R8��C.�+���m�N�g��@�]_�#�"�*����d��$]s~͌��Mc�2}�e�&{���N��5:N��چ*����%����+@Q� �$�),�t>q;5	z��Z�eFw��+ ]����� Ӌ�Iw���H����M�{����^�3S�����a6��u���M�|�Tu�J��K���9���[E��~	�R�)W_���)y�˵Wn�p<{e���/��ݡh�Y}��s���������&]�9��3��w�y(/-��8N�i@�	�[��t|S����=S`t{�z��%��̓T{��ֆ㦈-0����Fv��SQw3�WW��_�}jw�@��g�����	8J���*��<'�v�yp�{�d!舤�磊�����(&�.;7�Ç�D�V�!?b�.�z��'���˓�[���!h�F?$Г���f����]/p~�Lfd�ɭ��hTm2�=�6�L^�j3u ��g�q�U��o�G��I��]W�S5��1���F����� PnE
�[e7�v��]B6�Tb�w����J��&%s�����gk�Q����@���
�k�� S.���[��z�1+,�]_b�����x*��2i釪"H?��U���8)L�Y�[�ɓ�J�Wے�I���g��k5�O+�=��W/ �J����7�^D]��`��o�TO�����1�|0ֳ@��%Ԗ�y�2<ȐI�;��wZ�L%ren�]�� iu�>��L��p�,/7
E��@�#�):������^���y\�ݧ�aI���rW�~f`򩟼�ǣ��ً�P�&$WЯ�v�zNЏ�(��i�h�a�zS�M��1�k��Typs����=>y�҈�c�Q�`�kg���Ӆ�m�0+�\��!��C�����-�'#�Q�5��$(TY����4[4��r�g2��~aV�i��<>)�V�ӛ��	���A�3��@4*�!昶0�K�j%�)�Px��5�}%�6*x) ��@Ⴤ���!�Կ�AF�2����1d�Kp�A'h���� #��KJ-F1��iDĀ�c��� �sOqI���6��p�s$��G[;�8<����T�l�� �@U%����8�W~4�TM��pw���dH�"¼�M��h��(B=z`����o4{dcR<�}_��Ël;B�$@��M=�7z�X:����6��!�-��d�������EW�w�;�86 ��=���k|rNJ>EA>:{﷉��6�s
K2���f <\r!B���Å�Dc�Q�B`Ҫf��t��ʹB�gI�xn5@�J�n�s�c�em��X���^�Bw$N��<R|���wX��?�����~�g�2�s�z.>�f�7	q�Gs���H������b������<��~~L0�$�����'��9ߜ~�i�$ͥ#I���*5�]��]�%�+u�rO�(8�T���N�5�|:����>��h~ /ۇ����lTW/����q0�%%���CՇ��bw%�UJ����p�*u~�B�l�S�X�dI�b�o9E��Ampddٟ,�4�EPN?��z��# �&&fT@��\7���%f���B�� ��yFY���h��5�<�_�ج �����m�T�W�P�K��>�/�������A�.�5��܉�ː��^�?�o1�G2�R��,����Z�}���(G<�E/?�T�0�c�xd��� b��Sׂb�}zt;�W���חʂ��{}�C ���D��r��X^vd�����5�O�ŵ�-���F5�r� ��=B�8���t�� u&{�Y��uq�x��	���2��'VOˋb��?�du�TJ׈Ϲ.d��xuM�81�Z���E�Nn����M��y�=��le����s�(�������ޖ���8���'��I`���=�����=0Yn��|�nZ_���G�3�)G��W�R��Y8��� BhL>�|��@�jK<:�(��I����������Јԅa��#�BJ%�������O_HD�b�6]I_���t0}��οU�k�Hq�ޖ6;��ʝ	J�C�r�l�i�6�|/Ie�ۖE>(���.ԁ�0�+�#�S��+{��h<�����n��������$#DA��,��}e����K�O�UQ�c�׶��4�HF5dj�==P�@k:T�
_vh ��ԃ�R;��PB�ߑ)g�^� $�'6B���hyEr G���ȝ�(�&F��2�mEJ�Oj�7%��2@���&����q��U-Wt�IĿ$ F�U��D<*'��*���4_%��8���n7��CVv��+0v:�o]])qz�vSs���m��~C�IJ�m\d�24�G�y���.eo;E���iCb��,�]b*	92A �SZ��b�� �[������؇C��6"'�[hՕ����ҁ����;;&l�N��E������Q �$Y2�꒵�T(^��*A6ӡ��S�n��$!SZ1m��P�P��ÛouD�H���f'�X�+\��̊���_z��Io��!�����$=0�0S����C-p��n��}Y"nZ*��L����(s�ꈀE��� b�gh���tȚh�8[H@��1�׳�b�a�b��oĳu ������m�vH�Q!x��8 ����$�b4�G����O;LF�Kp���
��s*�����d��嬄��U*��Xn6|���x��;�-H��ymp^\(em�"w��F�s]8��6�m XU/�P�B��GW2~���[����d�����A�a"�B-(ui"�B�	��x����$����	������$��5�@�����G���Ș��%��e���0�����E)b���k�2I���wӉ�Y0ٟ67A���A5�v�W�8(��<U3�9�JJ�@Ch���$f����A<���ny0��h���C{�kK�al3g>�O�?���m�f�pG���:��x��w�g�MC�/B��������F�;J�w��I��*���$I�7�_U�W������y2���y(��>������?9�+t���d�Q|o(@P#~A��|5��£,R��fsIL�]�xk6���I�ik��뾐_�    _Ǭy���q.Y�*��+���w�������rV��מ��?RE�==@��I����F5�<�I�}0�HE
Bt�߿����1�S�����1���m����w�`R�,�������d����5}~�����ۑ��i���d>?������)�>E���gN���{�w��f��g`�y.�?�C����~S��������*Ƶ�9՗���)�����k��򟶄5�N��k��k���k�'Ǆ4
N��vS%p(T?I���f�C�q|��'m�qτ�$< u��{>�2�W@�w�Lz?}Ԧ�QJ��MҚ���YN�8I����O>��*����/�%,0�����0@�F#�k?�=f SZ#��.CW��?��9J�ʥ�:>V﨎�yޜ:����G ���F��؟!S�4�WhښÁ����ɧ���v  ��[A���.X�-�$)_]�T���Q sH)-��Ay����9�j n�yn!/��݅o,^��ez[�5)����z�2ɌY�5��h�5����>�A#D�D���Cy��S��	�@:���g�L=�l6 �~�b���d��iix��{��$ᢐ:)�O����Y��A�Sd	����A(&<��n����p穚M�TԬؾwqу'�E'�E@��Ō� ���htx���=&��s�����ԙ,j��W��/����p�<YJ,�C��u�c�4K��%��> ]��?zV�0��^��$����p��p�(�m�t$��3H!�U��,�_1Źf)rWJ�$kldұU�f8��b���$ ����4t�)B���@@c�]�������>�{F���BQJa���N�~�6���Z|V��3.�4��c��h���e�Sꀺ9iС�}�0�� �����q��	܊�
$�Є�.Wd
tP���FD�b�Lt��.�7b��Ψ�8�s�{�^"��$��e4�ţ���)L$�X)JU ���b-#����������*K�^t��-�^[ �n!���%�~��)00���3�f��a1����MY��S��)�p� B��C��?z7���p]��9�d(�/��h�c��� �yu�
�w��^��?j���i0�`����Quڋ\4K��-�oY?�}�nC~I�v�O��8�.�2`L}�"�p��>��S���M������-0�x�C�wB������#�@�(�hs Zw�6�(-M`��:�ORX+:������E����qS0����i�p	S�q��QA����V#��� /B�c�C�L������.R����+˚.m��o�s��]f��L��R�\w�,1��In�L:����	�"�����5P�"L&}{�o]k�e���=��O�ni��!����~���h\8����h�O��� ��Z�����>���p��e����Ty7:�pM��Lu_05��M�	�L��W6���cU�kg
�xC�J�o�)���d��\\��!��D��㧠����o�/D����]�DZ���[\�vM�?�^0�A�?߂����؂/0A��x	D&^~������@�#L�'
�M/B)��%�zh8>�f�kޣ$�B��T��[��e�jȒH��g�D�|8�D�R��.�{@8���i�v��.�B�6)�5;��/̀S��&�b�[ ���z$ZR"��5�3�Q�+���s�} �2������so�b�dO�J�������9���އ��G���gX��f{~��Ss����	�o��T5Ȋ���3����{T·�$ƙ"T�l��b���&��`��p��^�Ξ⓿�D�di����=�<�9fXIk�I���u9��"E����s�M��j)-cS	�R���PD�� ���:t�"��j^
莽�$?�&�y��p��BS,���[z̉�H8+��3��2%�֢��t������Q9���ܩ�=����tSI\"���w �2C'�]���at
�δ #1��q{�4�.I����:b��B6��@e?��hVѲ��x�(5���K�K�x]nu���� �x��8@1쭂�o2X��&fE����4ҷ��N��Px����ͧ�������w���WsM>#����C��D}��vpq5G� k��:a�qo��ZI�4�$c�B����7m�'B�߭�6����z�=��oV?���3P� ��Du*��"ٯ��L���s�n8
y2Y��Al�E��ǩ�;�
�J;��ݲ������j$ou��#X^w:�h5� `�^@�����3׀ڂ�7����a}�|�D�"6b$��2�^+F�m}��f���E8a����=���]�i��_�J@N���g=+X��9�`����IҠ=�#�!��~�ٽ�Nn���Q��Q{�Ph�^�)��d����R~�n^�Ē��3x���T!���Xz]��|��j�Q�/)�a��Q4�ng�"�q�v	�pe���k�܃��^=N��1h_��a��ʏG�Oѯ &�,�Qcb���Yi���
�B:Z�;�O� }�yY�AOV�y��}���,CEw��5^Jj`���`�գ*c/�~�
�9���l�.!E��Ђz�-R���E�W����n���<l��>��^gJ��"c�Z����Ōe睈	�v�����(�w��$Hr�#"�4����Oڂ�O�y[F㿓_  +��X����x���p��/p�.D""H�{�|?�WĀ�����K9cC:?VI�{Hk�v)�0w�����4\���f��,я��FIc���,���Ȣ/k�͵���L9��\}��ik�������~�¸+���Η��d��E�B�{��j<�b^�/�͟�n�g��:�0����55x�>����$@�#uEOƗ�Ő�,AATz1�߲�+�>[]��No�|�w��?��ظ�/B[�᪜��UW��`7���&��nhZ#���u��~��N��@ܷoSP�E�<d���t���A`�O���`�d��-�i��3q��rߜq�1���J�(�z�<P����b1�4�UI��u�&� bK�F�h�Y@��$'�Oӛ�j�Y@�o�W�@�q�b�]��)aKB��M��&u?��V����@�M����� xN9bmML�zBx�H�_�)����M���=9��<��"D6���(��x������(ò�N��\O>�`"�z��Q>��?HC=��pz�%��n��B1�O�>x5V��M�ZV��CH�ľ,#f�p�~���������*�!�XY�w����U+�$\O�l<�U0���4}��\�C)�o%
��6�O_�K\���y}��C�[�,�z]���pJ���
,wnI����/n᳅�Hq��[�[�؈.��@�Rz}����R����c��
r
/1F�g!�?� ���5��$7]-�����6�%ntQ`oA?�%��x˶��]hV�`��`��Nd�K�R(W|Щ��T^��a���x� �+:@���܌{��z��?^����~�U���N���,W�~J3p;�O=�%�8�h��? �&(�&I=�o�Nݦ�N}�D;��7���68�O5h�_�*�$W��jZ��:F�7i��I�L: ��A�-�ZE.�D-����QrHh�г�B�R2�L"�@<З]Q�i`���Sɇ��~ƽ�e/Z�I�[�]�zC�do�G���1�р@ν�ֆ�P��+MӾ���x���SԤ��l.�9�w�W	�,�l�ۇ��_�Bo���Gߴ؝}3�"рEy�N����F�H� �ZP�X�s�u���������z��;<AS�n�&d�����Lڈ���dfJ�L��ҏ])������)2c~l�X ��&͘�'�Pd�#�7+x�f>�*����At_ېZG���ò��$+��ҘԲ*�_Z[�+ʪa�I�n:X��E���_��|��ڹ�g�Zi8趗%M Ű9��?`l�*���"    �D���=�G���!�h��q`Tk����)N��k!P�e��D�Ⳑ�7�~I���0����i�NX.�~��F*�)80|��M�}�sx���lfڼ�`��jF˾'o%<�vǂ��|���8j��&ϯ�)rXu�{���_�"�\�(��m�PQ�[[8j>����u���6����r+�R���z���&ٓ	����#�j��R���� �B��+��-
������:[�|X��|�,]�тDa�h�����ޘ3Ru� �;�8�H2���qr��lb4�k�v�q�K�_SP�����r���7�~� ��%�P���7r�;ʩ�9�p�zą�Rx�@�����-H�����D� ��M�m%b�읂@����F�������מ��V������P�����]�Ɉ��~P
�х��{����ta!մb�I��.�D�ȱҝm�Kd�:��*�k
��t�gp�8ak������j��i�z�-��"��ʠ����z=����.���x�Ly!l0��΁��N������T��l�@�Sz��>06.����P"&RǀB���]r�S^*N�|��6�vô���.d������@W�M��.�7������J�xt�����c�&�K�7��E݁<M���#l���}�հ�$O2�h�����ᮼl=�'å��*���s!S͵�:2��F6^[(o܍[-ٮ�{�����y$˪tWx@4�YSx�zx�=�W��~Ehj(B�{T�{�Zߢ*A ���q�Vف3I��hC�X�4@6wNC��ѡ���1.���ׅ�2j�c��KRʒ��h�Nĕ|�"!Bf���	;�v�2�`�ѹ,�� M�4
�b�҆��w9�`S+�A�$�!2��[�y�E,��7�ʸJFW�XZ����e-Be�'�3�R8؍��:��e�W*(���D���ⱃ\N#����ؓ c�F�ћa(���U�6{}�^d��D�0��p?v��zHxKwf��t$ɩ�'����p��[�8s�� �sQ����
	���)���� ӭ�6�M;�V+�Ye[�_%��h N���;�m�d�����7�R&��k	�ܶ����!Q����)o�K��#��W�ܙ����z���ʚ��D�ǿ+f�l�pr����N|�T��I�e��Bc�c�?N��N!��l�c��Q��ˏ�<!�{=�N��K}]���͆-��0�_Aﯟ\d����K��Pt�gC��;��j��qZ+��>ܽWU��zfm�e�BY�w�� iڛ؇}�A�f�-W��}�� �Y]^�v\>D���:��騑@��[�ɲO����S�n>�"��z���d8�.5�8	��;��	��ϻ�筱���DGHw�X:dr�ԏ���0��E�/�pT{=��4 ���;<¡'�?�t���Q<	�\�J;���I���	�T����C��q!��PO"~�F�>fS��x�/��[z%'CS1|]y�S�EG�mK�>��is����Il��u�k��0��խrlDb���`��?q	���.�	�UV,�1K\t/$@�h�-�_}�#xg�#�,q�"�c�;F-Ƴ�p��KPv��3�g���I6S��M��!�ݳ��7A���3��lU�ד��b"I��-�m!?�
IŜB���DkS��\c?��RE��'~��(K'6q��Jr���1Vɮ~~_��~�/��s�p����8���'�&�"Y��<:�����#��{UI����Xd�֤v��qMEn6�k>��1��i���%�})��5�s�.�K۷��%<A�0C�J��SrᨷFɴJ��zX��YA�͑��&�f�q�|�%Z�|� ��ѥ�`�zO��'m���&�VR�tk�|`��,� ��ϣbX��Jr��Y=�����J �I��Ɔ�iA�*�fFˁ`�q�ݏb��wSEFwy5go<�l ��/� �y֭�������g����IK(��226�V\�@�y�����	�w�����
�;�prr�0w!M��:��4_�۝�>�Bj�;�b$�#�.����Izi&+�x�#՘$�%�Ň�(!�L�8���`������hG�J�����e*I�����O���X��,�h��~�9AzWȋ������ԡ���epJ�<�VI��E�����H�d��d�Y�D�3��h�Og�{�H��������*������3.x��8V[�]����x,�}��gIނ�L�صZ(+����͎��_0R��8ne�����hc�����H�ì	��N�`{֓����}����x�[�4�_MzD���&��v�F�zB�����D���Ea�������.�w�-Q4�8�AD�mQ$a�E�I���e��s{9��bX��l�vLqa[�"ed�dR$�Q�źsVJ�T:��ͣ����D�]�):tT\�����Ē�GU��Gx�{�p��0�,�Q#Af�"�;s�Y:Ux2���l�#Ë�2q���J����(_��/u-5��p�'_���ϲT	?������;��T��('$�q��?�#x�]{�l�S��	9�Tb�L��K����	R��~�A���v)��e2��w��e4P �-�� ��V.���粗Z/�<b�U��T�)Qye�#$C�-5-تS�.R2�����g���7��h�ɩƮ�,�UL���25>LԷDߜ�w߽�Eu��+��b�@�RW���?۽�u�d�H0����Z���C'�,k�t;`����ӝ������fו�w�����u-Q�;;kB��f�������+#7��A��lb��ޮ�,��qA�I}�zZ�fXj���p�;�.ax_��c�s@Ă�32?A�=��<���ҧ:}�ĝ��׷�����9�$@x�v�,.���m�R(��&ݪ���f%��Q�%
��E+���"+������$J�:� /rJ0��k��8�z	4>xr�l�`o�]X��7���w�S�~�H�yG�l��*콝 {!�ra_�0��{M��`�-�5���ك��DE;(d&�VEw�Ǡ&��ug�؆�3���A����Pj����鄨���м���%�M0d�`��}��, "h�5NW�2���bM�U[�N�P�ő�P:��
l�4�����F6=hX)dC�Î�޶_w�S��S>�."F���M�5{a�14��}D��Y:E�߇meu�����|��>����§f=�0
= ��y�%�)='-���&��qj0�>��a���{���W[-C�j���wσhp�OC�(Ω��@��yҷt��Վ��Л�y��m7����O��%\�t�~�P�����e)sc؃ E�{�'���I��ى͘��-�(��C?��?��)��3�_�;����ڠ���	�����9�BL��7f���JT��}�wcX�R
���;@\y����?^��^�rV����O[�	�oM ������| ۑ���*.�����Y�LF�ghɏQ,]2@�9�O$+��a0����K��-z���ĥuq.����7���q�+;�~��P��Do�)�w����O�W�$n-:��<�5� �E���l���
���:�_p@��{9Ϯ��/i=�4�eҶ�x���m�_|�E�X{��3�k2y����XG���o/�(�v�������;-�����CE7�۳B-"����@Z髹��A�rz�<1�z%�O��#�M�˝����٘dN��|4��w[�ԃ�;��q[�R�ְm�-6�����7�t~�AH��8���Q�$�`��C���2���\�;�Yi�� ��m2k_��kkW|TZ������&tG�׏!�k�s�J[�jdҘ�֔���I�zQ�g��B&��F��Ih�w"l�J= �+,�s�:�Wt1긕O�Z˃����T�Y4|��#�����t�c�Z����| ���(5�!�� u2�v��c/��.o�M���<KM�)��qgu��~WS��ȓ��dt�    �h�T�e�
+U�Iz�U��lM����>���.�%WF�/׀�!��4ذP&��Zx��w�w�"�]�Qy6���uu�[*E�g!���tڹ:5ə��&Y�n�V��}t��=_��7����z]���>44{Iq��dt�I����s�|lsIV�P��荑A4��5K�}�VU����D$K#������O��yx�<p={q���Aǚ�5�wA����7� 1�r�v��{�E�4�:����ò�H3�O��.�<v-(�uN;�?J��$�����<��[J�$�++ё���&5f�aD?��V�N �B��a�����M��AE�<*�Ѭw���gi���w(L���J��k�ϼ\GgM����F��X�Gu���W��ɍ/�!��Ft�N~�#�˺�~�	��Gr�F���Y��b6cq�I�>O�/��pg��"[��9�D{�nmH����F�"����<I?��eQ�U��p���jo�8�s�H��l���\������2��� �k��+"Sd��RK[Ґ��)���sfS[y�|�wP�g��0�%���z��;�u*����(��@��h�n��OGU���,x��{C��ҟ,�@��D��м5٭ -�}w�Z%>�ǇZH����ե�,^:�Ʉ����~�;��dV!$Q��/�%vg���i�w�����}�A�֢}����|�W�+����,�@�}��ٯxk�?9]C��	��ea;㙒��9L�qa�S�DL58��L���	��,���F3\�b6��?R��_�-�\h��v���]:˗��.��\��f4E���]�u��~z�,!.f���,�Fz�*�aa�ј��,EU�T��c����/�r�,�n� �@f �h�X�TEz�<s\��m(� {�	w��������ы�h��,n�6kg�-�/J��U��6c�ݮ/���#;6��@U�gl>�\ˊ{/��ߎ'�>����u������CS����H:�z�>^��Ԅ0q^lZ_ ��XmJ�a�X����%���d1F�%�y��֞S�L���b5��F%�Ù2 s<�t�;��Ƅt7���D�����8���s2���uO���d�-�E_~CZN�.a( �툢�����w:X �����À��	\a�}��u'�H��J��E�|�[����dpf�(5r,N]=�o�lq�.١��n�֠�1t� ��EuD�^�E�4�01 '�P���t�,�4���m��X���7P���bg�e"���������]e�c��t7mO�]�$� h`;��P����6��]�A�������@����x��ؕ:����Z���[�$k��R+��8=�[�x��W#�F*l%�)�q4{�Y��Ȭh7 ��兑���ڷ\dK� a��>�I�ς~�9�5+K���{;�n)��1�?f�<�r����M�|AڷG�w���\LwU����H�v��n?d�Bcn�ݺ�c��hӤa�G��w�U��w ���A��V�П�K�{g��U�(>Z�3��՝o��*�ȝ�]`�i�#��r�g8m�7~����d1i�p[�d����`�n�d���<<z%�eK2�Zd�������G40*�a���b�E�(��1�mH��Z�;��/��L�Du�d=;�f�E��=R$zD4L�W�����<�q��8�~��o1ȇ@��U�:�Y���|�d����`q�`�c&�S�Pa�	��=Tp�Y��Y$�6���q�Y�0Y8��@ª����Oa�8a�N���>�t9]��{�(�ٗ�'�n��׹�G?[�E�<4�xEb�`��g�٘�ƒ�Cb�d���̕��P5͔@n���JgZq�t]Dg�!o���ʦg�A�I���D-��2�H�\b��G&���v�Р��n��l���#d����'O8��֔Ϥ���&8��'���Bf�zh�U�GF����jF~�-�t�^?�;�{�
�
9V�14�+pF0��x��dGi�eO�ދ=�A}�Lয়b��<	�4�f2�;_'�m�\�ل5����ɩF
5s0~��\sB�gDEy2�U)��0���X���|���H�;&6|�vywWQ���u�7y�#�	\buZ[V��j�3F0Y3GS�L��%�!���UΊ�.;��M�����T�e߫�IMsĬ�1Y?U�F$�/h�]ܫ���ORL��� �����0"��/]�Ǭ"[.���w�~q���P�1�
I�����]La.�G����	P����ُ C��w��9X�n��\�]��l�V��^�(�݆h�Xcr�m~R]�����S���8�����44і%e�z�<57)�{(��%����۳Bt����{���&6���4��	��_��U��s�ei��.��v�a��0˗�ZY� {O{�,K��"�n�+�O(����1��2=�E���չ�B(����G�8�*�!�!/�ĝ6��8&��Wf�6�V����o�"���v�Ö{�p]H����~m�w�������*�p�*S�6$�Du(���"�=���.Ի&�Cs:���a#fwu�=�6��F�ꪴ����+�%��g[u���k��؟Z^^�Ѽ��o�S9�4Z�4/o[E',jOL��n��&NP��}�p`�F�č��ޛQ%遦�@�ޓ���l�{Xh$C��r6�E�m�x�dQÎ���O���t����$�u���9��y���mE��7����k��
����=A[���(4W\e����̐�]��fS���g�DcT��K8��|~Z{��=��>��H���Sc{�����C�xYCp����M��F��o�֑����]F���|H�]�<nn�z{D0�x|��{G� �l������؜-�qt�ʉ3w�J��*\C���ɾkb[��У�d�~���ԙ���BpȀ�������X������=�o�Ϫ�ӄC����.���ŝe &iݡ�1�DE��cH}�Y�DC�U������[�����y h�w�<]��M(�h�8�!h�|��3�e���~�����Ni��Vs�qc2A��&uo��,�u��a���O��Gu~�5��-��K�ҝb������y}^#��Y�a|��=���]�h%�lttsuӝ�XM����e�m}���1n�;�`�C�_��4s�^��F�)DN��~o��/���"��'��^�0
�,�K�9���S��Q��
�6��/�oS�ߖ8H���g'��Z6��b�w�Π�u �՜�fϻVa"*)W�n B�d��$����k����{E����e���<_�>��[z��2>-b4�`��������e�G��b����Y7&���0����x'� NU��q�G�v�@1�	�QkQ���q.l�i��= yO�Z'�=�^}��W�2K��,1MvA��ĕ.`?ƒ��i� O3 ?�"�;'≾؀V��7��׃�~�� �6v��'�!�����c��%
�s�ϓ�>���<k���{��e���������������cޡd�h������\�0}��&���p���S���Jj%39�*>\�W�i��S�}D��	Ӽ?ڵ:V	�Y=F�z�i�?�C�s=�'�:��~���9��K��n|�n
'��eI�fӬxÎ$��d�{����4t-)rLV�}�6�p��ϧ�Y檏͢:moIx@E#�l�ls���F��^��u��Ss$��
�P1�!f`����U�du"����F�Ê	=���gN��(=�0
3,�����y�P�er�o��>�3��g	/[�4/l4S�b=����+(�"�9Ɋe0 ���u������(�1����]��ot5��?5�Us��z��Ň�7 &]m�������[ 	�v�Є���%3�$�?Rcx	�!@u�����4����ɱ�����fr��FY%��vɃ��>��kP3sǯ�졭%��E�{������&O�xMRW�dj�?z]���C*�و�?{$�L��    �,�&9��{#%�k�P^�w�5�B� v���m��U������k�%��gP>�f4�R����q��ql(E�Ɨ~����|�
���D���=��g�WWN���[���|�i�4�胠�/�Hי��VVt(@�OVM`M�`(���[��K�!9 &�j����[*�0��x�8��k��#������3��*�-�a��zZ/�T$�V7�vΙ�J)�$_�(�x�o7 {M�6f7���x
X7��t�2�<�0#AL7z��(׶JL�~��\@?��Lw�"J'��D'<��a��r\�����i)A�s3��6��H!�z�q�P��S�+�1�R�[C��Q��1_�Œ�\g�Gj��y��f:��ԓM7�n�C�E����jK�\أ� f����J��9���߷o�4�-B�>��A��V�L���')!����/���"+��K��$?�4;�y��k��d�5;/�>*p��,.6����fr���_5��d�&��1_d��bM/W�@���v-�;�����d����{@�D�ɱ�4�9����а�v0��N�"
�|��i.�>{��?��5]���j�*ʗ����mu.�˿(����)��T	�ۍq}���h�z�E���#4yMZ���⺚p��m�����-���q	�B
g�6�G�%����	HI7�|E�;��oh�Z�3]�h�vFn�Ieݠ@�X��jt`҃��f]<�=n?�!'�����\���7.�Y�4�>{\-j��0�u�X�h�XGg���q!J>�g�15���WX!��;�\��Fb�cN����"��B�4�iD�����t<���AD�f�bܴ��yBw77".>�ϻ�鏘'I�oL�I����e�̤��' k:aX�����������1_���R|Km�Ђ�-ۅ�S<!c���Yg�)T��͝�ߢ3`Qє2c9��jb1�Ǖ��$Op=C���x
	4�g�R��̉K�`oL:ޢ8y��s���2է�M�Ԍ�.�9X�������"(xo�O��lh�+7����+��9��~c��X'��f?�,�P��.�q8E y��D�ae^�b0�L�-$�'!)%ܛ���@��Df�j	F
�T�_�ǛO�ɟ��8P�6R��e�	+P<���9�t���D�$n���_���;v�q�r����؞kA״���Ү����C�;9)H��O2cR�՗�3a���e�&;���[~��nm(5�X�9�u�Z��]g�Ms���~�ѿ���$��8��Z��:X@��/�i/���Bge0��u��ڍ	$�����J��8&�H*,�ː�4��ʩ2�.�x*�(��8˟GG�G��	�/��@i�C�2����u4��p�.�
Y���)��ɪ�ɘ��D�5'BX�H��DG�ŋ���a-!��	��"Y�%�iN�I���N���9y;^Gf�o�P ���6�xl.�_o������H14�>j�"��b�j{��t,:~6!���|��9$�����C׾�'���a��=?�q v��$��6�G�,*�3b�Mj��9��-��D�0+��OC��$9�-�(��-��9�؋��x�A%�Q4h�W6.ӷ��Y�ޚ��$�� ���/���,�X��t��|:=8���I[�,Gƫ�@ ��h�2QG��>i7<��K��~s�$��n���ˍ�{R\�tj��t�s��{6� 5���6 ����T��
n���]�v5ғ� �t��h�%����R�1��gW���\e����o��H���M%�z����B�A��2?.8?Z"Qv���:Q_�!��b4 i�]�����a3t�'5	���{Z��-��]��l d�_���"��q�N�h]#k�[}=�6��ڧ�}�0&�;��v%�@(���H�$��5Y!�l��yD���L ��$�Ƭd���
0�.�.6�` �g������f��ۣFT"r��i/J>I*,Ve�B�P�#~�n�^������ �p|ў�G���^��!.���U%�=z���7�jT�!iy4�c�v�~id��}4��� �v䱖ޱ�����i�uE����i��ȉ���5W�� �t����BN��YN�yT�<��yH)��H�5�2�)i2���~_�j��knE��@iZxGY?Ӆ7jz��C(o~ʿ��rFM�LO�;�1�I�<{�W�|z�Q�$�fؖ�X8��c�w��&ޗ�1��7�S�/�XXQ�p=}���B(lq�5���W���+R���<�|���_�:���j_�����']b�_��h���:�$�'�0�[2o���I,;�a����a��/0Mi����%L��8��%�)ҫ�SE@���C������e�=������|�Cg�`G9��^:�C�݈M"$�yn����nc���GX��Y�mj����3t��DT���t�����7X�:�^�:c�g�F�CX�[X6#mj���Ť�e6+u��O"��sa������i�戥a�<X��X��;�SBb��_>����H��F�^ܫ����֜�ODgp;G����X�x{F�����6�����}b���@�q���|�a��z��p�њ75{�yzG��?	����!��O�����띍34�����^j�G?��fC�{����m������L������o>|�*_��^��!��l�/uo8�������\v��|��qTC#rSI��>$�s�)��~�C9�P �H>!w��h3�'Tp��hx1������R����Dj#�_^α����r��
��b/[H���he���~	�M��	OI��C��d��K��'��=�r���	��V��f�R@�]5�~+�FtiВ�ǜ{���_�Ğ���<��m�t���G�:����L�o�H�r��$���= gA��RH�U�~*����J�~Gi�c�o91�-�����ef�<��ag�^�MQ|0��|��`Fr���-�����2N��E���\��M	`dʝ�7R�:e� �����J��̹I���(���5{)!B�a�86{Â�w�d�
:�	C�;����]	�6��Î���G���^*��tG��ݏtrF�tWx�|�����!m~�:ѻZ�K�"����&�oO���}�#���Ĳ�~��A���2�㶜��:*Y�~1�L�y��6�z#NS�vE{�yC$57�l"�H�DZ�Tɡ�w��,ADY���|���L.��X�o��V*bGFcy�l��ۍ��W��u_[�������������WK��K�V�b%h�*��Ҏ7ܢ�5�w&�id0p3�$ R�!��hU���ZO^1���c��{�Q�ᨻɴ0j��i�s��OO����_�t��5��%�	|v� 0�_�a@��Xze�.�-�����|���%����F@7�AX8��G�C�Qab�\�������z �66<C�J���ze2�������ϳ��V�D3��9#z�$r��T�wJ�*�UCP�=ٻk!�%�XV��z�)�e�n��)@q{�-T?�w�Sx-2�$��uV�6)=j���x#S�A� ǚ�f��f�Թ�>�A�w�Sl {�6�z������M��vL�:q/A��'��+#��_����.Yb���`�c��^���	��U�4�����0�d�a���� ��;Oɸ��p��cm���g��a��1�;Gg܁.$��I�.������ ��R��֠��8���E�8p��ӣ�)H%���ӼK�~��lȽ�b�e
��@q����7}nG{"v�ߋ��i�r��^�!*F/��2S�:�NGD#%c��.t�Vf�n��:%�t�сԗ�9DUx���� �� ����%������=m��M�l�C���A �^7L�=T}H�v��9�2<��;��X"�k6D"o'߽�Z���]��KG(��$����(7�y7��%�՘)]�#$��/��R�UQ����0*�	R�T�q��%    ���ѲW�<�$�w|힑E�i�ZO��=D��^��Ŵx��2�і���q��@�Q;�4ͺ�݃ʨER�!4�]X����pm�N}:�b6�� :�'���*U(o�����p�N����o�n[�k7s+��oS%�
���sVd%ƀ6�?"�~r҄�w�믖ݺ/�Ct����T
�������hd���\
I��~��8���<�E�h���{j�D�è8b�p�Jhr^�"��T)6X���4sov���W)�zj��.��6������ܣa+"��i�I��(e%e��-f���ě������e�3�p�����~�i*�h��Y�3�K��2�J��[3�-D��5}�+��9[\��-���	�{�ǉ���N��	99�ȩ���~f��������z6�m4h��~}A�����\�Қ"�8��\EI�h=:+�NOd�i*����m���w%�|�HJY�m���p��q��W�J��J�����k���8���ZV�ӱ���dG��i�#`���"{�w�e4򁙚đ�:[�`~YwH�(�T�Ò���Ԣ ��5�1~�)� .������>��-A�hv	�t����A���@�1��U�3<�is����+~.0���Oz���xQP��Mn�!���A�FL�}Q�5)��CC�ݗ��7�+���{g�?����us�i]�D(�O�(Q��XPb_-��p ��`��H���K~_�C����D�����x�1�w�F0�~�뙕�iZ��8+��0-h�=��'�c�J~�w^fܖ�>�|����������3��+�̱�P�������=�-�e&�4��"#�q�Uݢ��k�D�ؖ`����6���	�ݓ���ܱN�q�	jCI����+ŵ��[̶=��U�i�Y���j�A�c��0Y�Fl�r礶��ݼ���u
hܥ5����'vC���&(%��ř��V�� :{(�u:f�Å���U#��Ħ�"0v_�mZ|O�>���>�L��H�r|�ܨ��<�d��	���Le�f�+�t_Glw�-�H�-̎��+�4�����'C[��y�� K�4���G�C�&hJ�q7�X�����lx-�r:�D6����F�-�s��((}}�@�,5��O�xD��L&4.	PW�^�_.\�{���1=��1�~s3�ۄ��}=�zP��c�FC�W{PI -J��}1�~Oe��o�<!2�)wSt��x�q����E�����+���ՓU,>D��t�DX!c���D=��R��M&$�{�p�<� �t�Q�ϜxP�G	=���i���\2�]3h�^ac&��G��ς���*����}�g�)FϤ�����3n(��a�G�w(�K8��n���OAܿ}���<O��[�d394Q�����B��cu��#�ɐ(���m������@���A�e��D��z	]��uƥ���֢��wԽ�I��~rT�/,œO����cw_K�ߕ.��Ib2������y�:�dWx��)<'��S�����Ix��X�|z�܀�{ރ&H8:�]����T�
'U>JX���"���鐍{�X��5�-)S\C����t�[@܂�΀:�)N-(~R�S����`����O`z�ܓ����Cx<�R)�۽F�O(9_ְ�6ɪ�̶~��S��/�]���n��|�Qȓ�v�/V�8�" ڭK����%�N��K�g�G�',����	���?͋d9K�	��o[L�O$x���Ԁ�d��T�E��sy��m�����Q���/Pc�~��pQt�nl��X��~+�N�1/:i/�i�x����O4���R6���Ԃkk�[V⃑(�4D/D�?{�ѯ�w�M�F�H�c�BW�j�[]�qyX��LXp<XC:����<;���$��B��QP+r/2~>�kR]oDY'�i�G/���^L���ў�;o����P��%N�J���i�O��=5�$��@�D���7ct5_����>��a���y�'�h��d�K��'��k_?�M�
~q��FnXi��?��~�`���g�^FBX�9�K�����ٮ��*�gæ�)�N����p�Fn��,"�� ��<�!��7P1��`�zXq�����x�M� �y�]w��&�+��G�x���(�3�q��F����bŏ�.G1ҭ��_�
�R��oRJ�|[��-tE��,��F��?|1&,�R��#��n�Ѐ�-�֑f,e��{,��3�8��βI���?(��g�	Jew�6�r_����_`#��Gs�>~a�1qژ}��g����v�E�U�'��C]4)d�d��}��ٌ5��.ȱm�ꚛK��C���X�Y�pl�wF*PN����=��6|�t�i��%�B:��fD��z��[so��� P��
�E��bO��d��"<���q�}�<�͗��H'�Ar�'{˰Olnϰ����1��"���/� "|'�o�mYw�Y�MJo��q�`8�zX��4��X�u����<m�A�rԋxX�����E���Z�����\<�A��	_���fl��H͎)nP��C\�I���'��1��/��u	�Y��4�`�}�A���F���)�:'�ZhS(Mv���XŘG!6�<�����u���;��S@�5j�����$���rG:S\���ov�ac��臚B$��w�l�)"��	2Oq�*�;�~C��҈��rH򤽲�9�(B���(���:�6�������Qw�!j��hY+-[~�wýU{�a�l๠�����kB�m��Myol��H�+E�ӥaf��"�y�r8OY��`q����C�}[�O�'��c�{�aHcM�zg�`��U!�D�=2�6w��B���V����~y|]�P*���C�-����e7}�Y�,�\�ȏI�bω���X#�D� ����L�oR�8y��n�{O�Gn+�,��>8:�M�b����x�E�C9���j	�<H�{$Oi���H����%��U��⚢O��l�셸C6���A�7�D^<^��l:}1&w5�}��%/ʛJ)�x���9����8&�+ -���w�����~�A���Y�!o.����]ج�q�@H�#y��ț�I�҇���X<7��BT�%�0]�ȝ�ʿ�Cb\�.H�D��(��Ҵ�"��ۓ��U���a'�f�����^0眼�Kkы�����q���>�%��A���1tU�m��!�ͩ���代�P�4�i!����d��T�	����t�B&��MP_I�}���@
胭�NF������f���X��V0*��3Uۓu�WB~�Ns�!Bm]ޚ�����!c���ճQQ�����C�HKt9�e1h��i�f����C}��Ł{������L�	��T�ia�y*��%�iu����h֟�ŧ�I[~�����k��ڰ,/Ѓ�J(\���^<�E'����.�,��~ݳ��������ۗ�II��!�m��CB�����т�.�=ms���<̡GV:��>E�,���'�x��vט��u`�Z������r? �rLf�
���� �h�Z8$M#�"�*�q�P�Kډ��͕B�w��a-����d�����C��pq����c�Z\����)t<L�Tt��`�����y+^���-uQ��✠X�<�h5�$��M`S0�J��F�7�gO��"��Z�P���[F$�B��[t�wM��� �e�7�J�ʞ�T���ٷ�_���cwZA:�*Rt
���D��h�?n��������<��Y� #(T����`j�;H�R,cd|-.�u�E��_�
.H\�%�й�b�o�-^I${s��7-�����Zş�o����^�u[���K���BVy������\��ܔȨ+0�,��U�O��ζ8q���1��ӾC���dX�IPe��#�%^� ˁz���n͎���y�n|�'}aU�V
��5�#"3 ��)x��5�,")�v֋�d�M�X�f�H�kPz<��(3� �fy�"{��,~�Th�-�I�#���[U	E���CHP�d��[�����߉�[ +  �Bs,��J�Ge����Z�c&$I˧�W�`1�TP_AI�" ��Q��j�2�l� ���s������ �}|y�.Nzچ。����uJY���'4�3�}Ț��8����F�
�h�����m���h�.;��a$�T�2i*�U�l�4L�������"5���@���������6P��4+:�c6W��⧶j<+8��W�dh3�1�k�FϦn�i����P<&�+{d�;N�<��+���;Ds�1?%Y�V�K�/(lx}��ے-�B�e��-%)��V{
U^�Za4��JԮӕ��ᦦQ�J��Gκ~};��V�����hbb����8RF�>����O��AbJ�U��BT�b�Tt������fmK��Gl9�&��*�&�/��.&�>1�!e��١���z�[�"�q�w��w�@�rl`Ѝd�A�j��vAIB���5D������ה���('�U+4��{�)�z]�!�K�Dޯt�S�52�E�}�>sa$�ښuL{��A���\�-��B�F*��bY���s<i�.����lℽmp�u(�e�U�\��q����=����*��(x�Fqu�ʊ�ĳ��ɀDy�Y^�9��u-���#�1}�o롊k&}6$"�S�Ӄ�'^>:ZC���j��f3r���9��#��e$eW�W��� |��Y�^ ,4�g���r<^��2|������w��+]��_��(�%��a$B�x:����p�����ɵ%l�2��đ�n�HZd	A���z�^V�RQ���ߝ�zkm�ڑn�q=�-z ŵ��Zs�e�V�Ybd�é���p�����m��ZX�%}�ME�I�!�W^6_|VQ/T�ِ���ћ�G^�CG�3�Ǽ"q����,�\����v_0Y:$�h��Q�H�!��P5��?+�U� �s�tk���:�8�8�k�ȽTԏ�������y<����j�|�Ǔ�!v�b(K%E6��qU�0t�o8���q�ءF���\�6�
(�7K�FXm7�XV~�P�T����s�mxBPt��Ԑ�g����U���-��"�v������0ŷ�;���_�=���F��(B��|P��:�	x$\��J[��v;��^���=�Pf�PG�U���.(Y��l�h ����KAo��;�Uᐣ����^/�u��ն���P�ǥlr��M/���:Ko��>â�#]p%���O�4����7Hs��$�Iޙ����4�ƫE�y���"���>W��vO4������������vE�3�,��)�|�7�V�g������EÕE´��AQ�H�]����0h��Ѥ�Q�\!�������p;u2�Ԋ#��l�������xZG��z�pO�D�T�v4M��ꛯhrצ+��e`����\�I�v��i,��F( tA�G�m�V�x��{7������y~�q�x����Ӎ���/Vb(�]��a!��`�B<���%�y�h�x�Kj���ӌ��^Uk2�,X�6�c�C�#
s�ݻXk N��~�ߵ'\�QZ�Q�#�]A���<�z�L^�!2�w��׻䚀|R�����}+ظIu�|F�{�S�������{�N���S�0�1��4�?<:(��Π��ܺ�|~-tq�zK6�]Yǭ���_�B�z�������S��^��9�q�V}2y�y��lڴ���J�#ﯢ~+�ш�~�{
7��?��i�����J�W<&����X���%1 �w})j�fO��&_�G��\r؁��5Q���P�yM�L����ȷ_�.���h>l�r�0g�s�o��*��c�1|���y��i�%'~����vc�:��3���1�^��Y#�L��pBy{��.���9���IxRgˢ�
�d��IWY��=7s*���L�������#&rՇ�f�e"�Z���lp*
���A�x~Q�4��B��s�9vC�*7�~�z�:���j��HLa�h@�(�>�?=)�mJ,�B%��\�������يE��,�������f�k&?$bN�m`�{D�v7� 7<YًGڈ#U�+��g�}/
�*���h$�w���63�"\7�ݖ��c�9��S�GD�#H3��5|{�*d���Еv��bF���S��e73�E;�N�{���f+\??~�8tl�rc��ʣ#�Zoc�?zS��5���ﰢFX��t���\�����Z�YY �Y�ߗ��k����\�����
����ؖ�Ǿ�U[�`��*\���Hx�������|z�8�3
o��x{^"���n:��=)�)B/�ڐ�X�=�t�$|��\}<j�0\���$���Ϟ+4� Y���!m�?��nw��֊'0� E��Z{ȕ,�),�5h�<�I4G��(�#r�1�w�%��$��m�-V�}FS��H��RB7o��gg=݋������T['��7�3��:��:���:���5���,#}�}�{�a�Fi������d�Y9XA���>������E��"�v�bFLJ�N?����	3���ݝL:r��Pu����g~��3� }���2��|�ڗ�KR������$��%��s�qe��zP��DI��3��`j�W<��{Hۨ�$�,	�A��:#ȗ���b� ��$p�Đ���?�OּGX�_���]�'
��u����M����U���7q�p��	AF5
=�zE`�i�r�hbe�`�����b�=�l���rf�H����|͆B+>�J������[z*(�	ƒ����?� j_�ޮ����b�c�h�m\7~��a��@��@8�V[_z��}�����KX�ݑ�f��E�����n?�f�����'�SH��搽����$�;��t��㽈�����K����xQ�����(�^s�jw��·T��gfcu�p��6� �<"��\�*L�����Bp3N�����6q�Ec[�y��5��v�"�}^���-��1�Xyڿ���P��a)w�N.��~���z0:�co9Q'^��z�������-�=g�d)��k+>X:]���h��U�F�?���+y�|�7d0Tu�|�+�9�x/�ns�ǭ/F7��,�i�1�s�	;��TTk�9~�V��v���~/��J���W���!m��5Uɽ�n5��9������KO��m"W�l�5d*���YX0a���z�K�SA��o%�1��� >~Κ��t����>�>��t��H;�ݨ�k�C|�.�Y�]����:�s9����2�� p�ٖ��A�ϊ���K�7��d�,�R����L}g��O���m�x�{�����&zNh,�*������*&{���qC�~J���YCΙq_}5"�f����A��T�L�׫��7��?�G�sI?6q~(���0l�)�^�
��b?p����t�j�W���W:wE,ɡ�f�,"Q��'�~Q(�D>dk
h�xk�W�^+��C�P���]��p�Uc���.�Ɔ����C�_$�%"�^1�~�U�g,~���+F�b�+F�b�+F�b�+F�b�o��i�X����Y����ڮgX��1���m�˿aF�A�������ę��?h��H��|�AI�f~�����o�����      r   �   x�}��
�@ 뽯��{{�t"�V�N�=�h�}��)�V�=��N�{�r��nw�bq���Z�c���J�5���bK^t�ֆ	��Ɛ�U+��
�ɑr4���J�`��)6����#6)nS�;�X����m���5C      w     x�}T�n�6}��������A���@�R�/��h91�Qyٵ��{H��	�$��Ϝ�~�=��G^8��3�B�gvB�%��j��>/S_/m�I31�Z��L#;Z$�9�@y��:a�e��am�����zj(��9�dE���
z�x>��ܺ������v����*!ܝ��B6�� �,w<�圔�T��:OK���9�k=r� 5�\$،V�K�x.�@��8:9��EO}��3K�F.j�H+>�L/�х: ��*�5�ֽ�Qg$/��f�Gz���*6�"�$��*h����Źγ���x�d�v��P���8ҩ6��QY'�4��|Ҳ�����D��N����Dӛ��G�Tuh����	��
�1�sM�Q�.o�f��@.�j��a�L������s�k�q��w_�r�r��&�����n����/�wWO���?_|�I���P��$�	|�}J:�` 6a��4�آ�{�:�NDt�	;�2��B�7�@����г&��/���;R����&u��7�%�%��c�K�j�aZ��K#�%��Sǿ�kTN��m�u|�����#��,x����BNj5��S�n�����m�Z��z7�eBd��֙&���NI��r��k��	���"��|�9a��e��f�,�YM��[(�� U�{Kn9��o���U�&L<��7jƊ;_f\Ԣ,�߂�\)?k����]���֦�q��O|�淟���N~����M�����x@,�      h   w   x�]���0C��W��פ�udaca`��B��i��$O������h����\ڽ�Bkk�Q�	��GL����5J'bMVt������������XĻ_�s뺰l�݇�=��P(&
      l   �   x�%�A
�0EדS�	"ں鮨(Vۅ�Rp3��(&��޾y���J�-��!�!�4,�,TL݊^367L�f�0A{�d���аZ���,���:T��[O~pV��~^/A�2��R9����^��~]q�1����ʠ�v��_m��x4      s   (  x����n�@�ׇ�`�2WXԪ�
�bl��8�i�����toҤ9��$�ن.Ŝ�\�z䭇QoF�X���y<��q"������q������c'W��TV6�8zfѢ&ԗJ�fI�R�����İN�Zef_U7��K%ϥ�����CQ�@P+�,�Z�CR7ݒ]tKY���Nu�g��*����gi�t]`Xs}�{��`�҃�9T�D�������ϱO�M]�r~�2��E9�H���Q�A8�N��.��,�A0���J:Vr���`	�򱰙���Xƫm����      j   �   x���MJ�@�םS�B�x�A����A:���%�j��3����Fğ��ރ�}����3�Q�����bM�%D�#��[Z�A���R����"ٶ\���P��ݲ
 p�T�Ec��&Ht��������fV%�s�"�ip{Т��a��o���%s�~���������>�J��C� ����.Sx��k��F�}F     