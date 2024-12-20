PGDMP                      |            iSKed    17.2    17.2 F    @           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            A           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            B           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            C           1262    65823    iSKed    DATABASE     �   CREATE DATABASE "iSKed" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "iSKed";
                     postgres    false                        3079    65824    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                        false            D           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                             false    2                        3079    65861 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            E           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    3                       1255    65872    update_inventory_status()    FUNCTION     �  CREATE FUNCTION public.update_inventory_status() RETURNS trigger
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
       public               postgres    false            �            1259    65873    contact    TABLE     �   CREATE TABLE public.contact (
    id integer NOT NULL,
    contact_number character varying(15) NOT NULL,
    location character varying(255) NOT NULL,
    gmail character varying(255) NOT NULL
);
    DROP TABLE public.contact;
       public         heap r       postgres    false            �            1259    65878    contact_id_seq    SEQUENCE     �   CREATE SEQUENCE public.contact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.contact_id_seq;
       public               postgres    false    219            F           0    0    contact_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.contact_id_seq OWNED BY public.contact.id;
          public               postgres    false    220            �            1259    65879 	   equipment    TABLE     �  CREATE TABLE public.equipment (
    id integer NOT NULL,
    user_id integer NOT NULL,
    reservation_id character varying(50) NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    reserved_equipment jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'Pending'::character varying
);
    DROP TABLE public.equipment;
       public         heap r       postgres    false            �            1259    65886    equipment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.equipment_id_seq;
       public               postgres    false    221            G           0    0    equipment_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;
          public               postgres    false    222            �            1259    65887    home    TABLE     �   CREATE TABLE public.home (
    id integer NOT NULL,
    event_name character varying(255) NOT NULL,
    event_description text NOT NULL,
    amenities text,
    event_image text,
    event_image_format character varying(10)
);
    DROP TABLE public.home;
       public         heap r       postgres    false            �            1259    65892    home_id_seq    SEQUENCE     �   CREATE SEQUENCE public.home_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.home_id_seq;
       public               postgres    false    223            H           0    0    home_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.home_id_seq OWNED BY public.home.id;
          public               postgres    false    224            �            1259    65893 	   inventory    TABLE     �   CREATE TABLE public.inventory (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    specification character varying(255),
    status character varying(50),
    image character varying(255)
);
    DROP TABLE public.inventory;
       public         heap r       postgres    false            �            1259    65898    inventory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.inventory_id_seq;
       public               postgres    false    225            I           0    0    inventory_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;
          public               postgres    false    226            �            1259    65899    programs    TABLE     �   CREATE TABLE public.programs (
    id integer NOT NULL,
    program_name character varying(100) NOT NULL,
    description text,
    image_url character varying(255)
);
    DROP TABLE public.programs;
       public         heap r       postgres    false            �            1259    65904    programs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.programs_id_seq;
       public               postgres    false    227            J           0    0    programs_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;
          public               postgres    false    228            �            1259    65905 	   schedules    TABLE     �  CREATE TABLE public.schedules (
    id integer NOT NULL,
    user_id integer NOT NULL,
    reservation_type character varying(50) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    time_slot character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'Pending'::character varying
);
    DROP TABLE public.schedules;
       public         heap r       postgres    false            �            1259    65910    schedules_id_seq    SEQUENCE     �   CREATE SEQUENCE public.schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.schedules_id_seq;
       public               postgres    false    229            K           0    0    schedules_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.schedules_id_seq OWNED BY public.schedules.id;
          public               postgres    false    230            �            1259    65911 	   skcouncil    TABLE     �   CREATE TABLE public.skcouncil (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    age integer NOT NULL,
    "position" character varying(50) NOT NULL,
    description text,
    image text
);
    DROP TABLE public.skcouncil;
       public         heap r       postgres    false            �            1259    65916    skcouncil_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skcouncil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.skcouncil_id_seq;
       public               postgres    false    231            L           0    0    skcouncil_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.skcouncil_id_seq OWNED BY public.skcouncil.id;
          public               postgres    false    232            �            1259    65917    users    TABLE     �  CREATE TABLE public.users (
    id character varying(8) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    firstname character varying(255),
    lastname character varying(255),
    region character varying(255),
    province character varying(255),
    city character varying(255),
    barangay character varying(255),
    zone character varying(255),
    sex character varying(10),
    age integer,
    birthday date,
    email_address character varying(255),
    contact_number character varying(255),
    civil_status character varying(50),
    youth_age_group character varying(50),
    work_status character varying(50),
    educational_background character varying(50),
    registered_sk_voter boolean,
    registered_national_voter boolean,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    65924    users_id_seq    SEQUENCE     |   CREATE SEQUENCE public.users_id_seq
    START WITH 1000
    INCREMENT BY 1
    MINVALUE 1000
    MAXVALUE 9999
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false            �            1259    65925    website    TABLE     �   CREATE TABLE public.website (
    id integer NOT NULL,
    description text NOT NULL,
    mandate text NOT NULL,
    objectives text NOT NULL,
    mission text NOT NULL,
    vision text NOT NULL
);
    DROP TABLE public.website;
       public         heap r       postgres    false            �            1259    65930    website_id_seq    SEQUENCE     �   CREATE SEQUENCE public.website_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.website_id_seq;
       public               postgres    false    235            M           0    0    website_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.website_id_seq OWNED BY public.website.id;
          public               postgres    false    236            z           2604    65931 
   contact id    DEFAULT     h   ALTER TABLE ONLY public.contact ALTER COLUMN id SET DEFAULT nextval('public.contact_id_seq'::regclass);
 9   ALTER TABLE public.contact ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219            {           2604    65932    equipment id    DEFAULT     l   ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);
 ;   ALTER TABLE public.equipment ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221                       2604    65933    home id    DEFAULT     b   ALTER TABLE ONLY public.home ALTER COLUMN id SET DEFAULT nextval('public.home_id_seq'::regclass);
 6   ALTER TABLE public.home ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223            �           2604    65934    inventory id    DEFAULT     l   ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);
 ;   ALTER TABLE public.inventory ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225            �           2604    65935    programs id    DEFAULT     j   ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);
 :   ALTER TABLE public.programs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227            �           2604    65936    schedules id    DEFAULT     l   ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);
 ;   ALTER TABLE public.schedules ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    229            �           2604    65937    skcouncil id    DEFAULT     l   ALTER TABLE ONLY public.skcouncil ALTER COLUMN id SET DEFAULT nextval('public.skcouncil_id_seq'::regclass);
 ;   ALTER TABLE public.skcouncil ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    232    231            �           2604    65938 
   website id    DEFAULT     h   ALTER TABLE ONLY public.website ALTER COLUMN id SET DEFAULT nextval('public.website_id_seq'::regclass);
 9   ALTER TABLE public.website ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    236    235            ,          0    65873    contact 
   TABLE DATA           F   COPY public.contact (id, contact_number, location, gmail) FROM stdin;
    public               postgres    false    219   �T       .          0    65879 	   equipment 
   TABLE DATA           �   COPY public.equipment (id, user_id, reservation_id, start_date, end_date, reserved_equipment, created_at, updated_at, status) FROM stdin;
    public               postgres    false    221   !U       0          0    65887    home 
   TABLE DATA           m   COPY public.home (id, event_name, event_description, amenities, event_image, event_image_format) FROM stdin;
    public               postgres    false    223   OV       2          0    65893 	   inventory 
   TABLE DATA           U   COPY public.inventory (id, name, quantity, specification, status, image) FROM stdin;
    public               postgres    false    225   b�       4          0    65899    programs 
   TABLE DATA           L   COPY public.programs (id, program_name, description, image_url) FROM stdin;
    public               postgres    false    227   ��       6          0    65905 	   schedules 
   TABLE DATA           w   COPY public.schedules (id, user_id, reservation_type, start_date, end_date, time_slot, created_at, status) FROM stdin;
    public               postgres    false    229   �       8          0    65911 	   skcouncil 
   TABLE DATA           R   COPY public.skcouncil (id, name, age, "position", description, image) FROM stdin;
    public               postgres    false    231   {�       :          0    65917    users 
   TABLE DATA           3  COPY public.users (id, username, password, firstname, lastname, region, province, city, barangay, zone, sex, age, birthday, email_address, contact_number, civil_status, youth_age_group, work_status, educational_background, registered_sk_voter, registered_national_voter, created_at, updated_at) FROM stdin;
    public               postgres    false    233   $�       <          0    65925    website 
   TABLE DATA           X   COPY public.website (id, description, mandate, objectives, mission, vision) FROM stdin;
    public               postgres    false    235   ��       N           0    0    contact_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.contact_id_seq', 1, true);
          public               postgres    false    220            O           0    0    equipment_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.equipment_id_seq', 31, true);
          public               postgres    false    222            P           0    0    home_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.home_id_seq', 2, true);
          public               postgres    false    224            Q           0    0    inventory_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.inventory_id_seq', 32, true);
          public               postgres    false    226            R           0    0    programs_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.programs_id_seq', 1, false);
          public               postgres    false    228            S           0    0    schedules_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.schedules_id_seq', 40, true);
          public               postgres    false    230            T           0    0    skcouncil_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.skcouncil_id_seq', 3, true);
          public               postgres    false    232            U           0    0    users_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_id_seq', 1000, false);
          public               postgres    false    234            V           0    0    website_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.website_id_seq', 1, true);
          public               postgres    false    236            �           2606    65942    contact contact_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.contact DROP CONSTRAINT contact_pkey;
       public                 postgres    false    219            �           2606    65944    equipment equipment_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.equipment DROP CONSTRAINT equipment_pkey;
       public                 postgres    false    221            �           2606    65946    home home_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.home
    ADD CONSTRAINT home_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.home DROP CONSTRAINT home_pkey;
       public                 postgres    false    223            �           2606    65948    inventory inventory_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.inventory DROP CONSTRAINT inventory_pkey;
       public                 postgres    false    225            �           2606    65950    programs programs_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.programs DROP CONSTRAINT programs_pkey;
       public                 postgres    false    227            �           2606    65952    schedules schedules_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.schedules DROP CONSTRAINT schedules_pkey;
       public                 postgres    false    229            �           2606    65954    skcouncil skcouncil_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.skcouncil
    ADD CONSTRAINT skcouncil_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.skcouncil DROP CONSTRAINT skcouncil_pkey;
       public                 postgres    false    231            �           2606    65956    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    233            �           2606    65958    website website_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.website DROP CONSTRAINT website_pkey;
       public                 postgres    false    235            ,   G   x�3�442�515�5��4 q|3��Kt���Ĥ����L�̒J�Ԋ�܂�T��������\�=... \�1      .     x���KK�0���W��m����$[ѵ�U���tƅ����h;� ��E9�����l�@��nn��k�V8l��H5�]Hϔ�)�{����%�EY��n�ޫ˧�{�W)y~m�CwxK��x���$�đ�Q@
!W�l���rs�8GxĲ+T9�J�T��ǒ`��:�z��qu�!cX���ٷ���	�1�V`�\5B�jӦd��+��Y��JBd1��L3@�Pu�JX�ߢ_�Of�����Q�X#
���F*.�S��vb�
��5]��ƃP����(�O� �       0      x��ǖ󺶝�ǯ�sjR�H�9�sΙOo���}�;�-�l�Ш�T k��M
�����י�=���ʿj�['$�ȼ?��V_�|[����N�	����f��i0�f[ЏYV,%�?/X����a��<��t��(��*J�.�U}���f�,�`�v��'V9�AҠ>0x'MW]#d���;f&�ň���;�R�6�lV�6;���~n���Y����,�v��`A�9"9�����=�1�!�}�\��3x��\�&�O�_�a؏��^5YJ`�ks'�>�m˕�l��|p�ǔT�5��d?���~Œ��/|�� %�2������G����E���S����Zy���9�F?�y{~�m�d����[�d������{ ���z�*�~^��D��r7�_�?�����.�V�d�f�/桾_v`B�6��ߗ������ڬ�C�<)5��;i��\�w6�01��uO�R��5Z�,� �u����s�b���W��	|h�ǾC�%cvs� &��ܝ�A��ؐ�Jv�L�ǁ'�uS�nBOq��"��3b�g5�
>�����
��Y��v�ƺ0+���W����Vԇ��B��l��Y�<�XUf#� ��*��A�d���]g3 $�h���]׏$��Y�������:�����rE��#569�	�y��Ľ�%hK�>�d�<9�N�M8Mp�ᴾ;��/&�I:��m:��ٕ�ހ��2�������q.,��lG_OLq��b�!�5÷Tb&n^�5m�46
}WP8�Y�O����sG&l��\��#���u���,��O��\�=�vĜ�/�ᬑM`�~}0������Ʉ����4bz����:�n��=1�Hh�E6��#�x�����  hmh��}f�H��� �ieC�`�}�,	��7��}�1��.����Ԣ�:�7fF;�x	w���6�r'n1ٝ9��ߓ݃� ��K����j���K:�h�2�M:��e�a ��\f��4"��B#�4�U����YSཻ�B�/��擥´B�p����:��1z�s
I��g+ץ���l�*��n��q�nq�[7�f3:�<��l�4*���	�'��|��4��8ˑ̨��Ơ��ؽ�o���P�A�(|f�Z�1�m��8�'r��%�BN8Ŗ�M��x�]�
��@CU�i<�/-�������ܮ3]���@�=o�0�Z�XL�_{��꿡AL�rj~_`�?(��2�pai'������FG�'���c��y�ywI�)��� �Vd�<���"�U��+��с|��;�_U���<1�
�&�<�97<m>y�h]`���%7S��t��o~boN��x�*ɷ��w���ܧ�\���U�\��@��r�KF�a]K;q}-P�H�TA$D�`��(*����L��ycRa���3���L�R�-Ey3T���Z��8����5~<���H�I&>ĕ\�HD�}�x� ��'�ys�/�!O�O�*��^۽��a�m�n�}/�³����}����5N�&;����+����L2#9�!�EHg���,��93H�3 �t��u�F��^8t�Ur���E3�3SfcJ����µ�{b���9�w�4���۰��yɫy��]}��Y��r���0�B��AJl��=�֝x� _�1y�e��LNW�ǎ��;�}4�����&>�OR�(��X�Q)�W0)EdN%/:8�.а>j��R"�D;��;	�3�>Ni[�ºC� �C�����xb�A��ȯ`w�L���j��`ů��v���g�S��&br��ޓ��ʯ��&�r%:������p.�t|Rv�޾2޵������2�ONd�t<o n����Fw%?:�'V�x{�P<_��:j�7�t�D�n�.Y
�#;=�x���������T��Μ��& 2���@�L`x7զ�Pz[(Y3s�f�����i�Jyn-��_�e��H��z�E�De���K�(桴�s�A�^��8`�@!����@g�0G*S��͝�I�L�ny^7q_��<�!�P;����KA
�*��|��?4=��H|p�E��8Ìd�w:�P��ە��S��YK�Q�a��x��yY����h����R�X�*�Ik��F��`�7�8�#h�����˙��>L�)/<0Y�:��xZ@AsW"p%s?@�CY66x���r�{�!@��3�|^�a4����]���d7̒V��k���RYM��`;s��@�'�1�x}��g����� �DҔ��K}�aKK�c�V�أC��|[8?�&0�ͦn��O��@�n�p����fQ*�������ή��i�����ђE n�(�^��i���v���OIG��)
�ɹ�W�ҁwE����Z	�^ӎ9���𷂕�P��p�%o��-�Op���r�Z�m(�ċ��gU)8�F|G�Ō'H�� L9y��G�{.�FtHU7a��P��W1}|�mF�(��_�k��n�o4�_��vR��C-[�!F�*�Ҏ����<�
Y+���Ϻ*8:�q,n^~�JP�`b��������_w^U��&^����sv����@<���X��j.�`�C�"<-�L,W�QP�|��'���i��=_h�)>hP�QuA��0cu�{��\OΛ�˓X�
�k}�;x}Z�*w���@l�����f�~-���LW�r��kg)���3����
ރF��	�o��xp~��.��`qX?��V�%��4DĞӢRI�k�H��|�)ߣ'[ٴEg��|~����&���%仛O���3�*�Bu_ �p:lZ�jG!�����i(�z�����D�>H��A�/�s(d��<T՝b���~�o]4���*&Sq#
���"��R�8��7��)ˊ�!���lS"�� �	�|W��?Ų)��xD�]'@���#��:�h[[Px�Ll��-C�����dt6]։��>"�1�Ogz����X��f��b�����.Ł���d�ll�a�y��Ԓ����#�+$��ɱF:�nО�(��.r�M����w���rH�E��Χ(� r��!�S�&�~i������� u�)C������f�l?�-�D�\�N	GPz[�РW,o�l�x�$�fZ�A��D��x�+��h}�v5�l���י
�2�?��'Ohxd�j���m�~���*ZY��3-���\p�����tJ�O��j�����f���K��5�7͛j��Q�C�M`}Y:І�
[3�z��կ��c�(��փ�P�T60PO�@pv_�\�PP����Іg�C���1E?E��3A��;g��R���V<��;g&J��KJ����`�t/т=�׮M�T�x����ޅ�p�w��M7/�V����,�2�!3��t�YX�k�L�/�'�KO~��[P��)���U�	��*�z�i$B��3카��ņQ���gL�#�\�,d�	L�VFdY¹ ��q���SPHb���u���h��	C�F6�7�s`�d-x`T�`� c@��*���3�<��g��l�L=�?�w#a/kT��(�����i��`���4�c����d`*R�}�.�Fn��-0�.Q����<�	��Av7ꀎ։|�o;5=�`O	d�rGǫ�{�Z�ӱ�}ӭ)����¢J������q��6ń�I#p���I��H4]E�#��4�6P#�w�ܙ0�+�b"*2�a��z�����'�<0O>Y�#�%�yP���e*�#�5L�����ߡ�l��,g�N�h�Hݵ��e�ʥŹ���0�n��:���N���K��_:ۿ�'7�'�s�;a���.�~~_c������1�6�A���~���{~Jx�A���ϓ��]��]Pb���{
�{�Q$4��,o��Yƺ ��E)05�y�F��cg�)����y�U>�L���XP#� cz73!A�m�@)��LJ3���1��������gҲ�P��O�wk��c+���a�=
�z��t+����ؔ    ����F���NI6E�[����M �C|x�("}U��_�j��NC��������D���=}�ǈ� 5���	?�-����FV����F,�(�~{�H��eC,W��7^$6s��� �-7A�!��C�D��J�(o��eF�{e+X]`5��h/����v{�4�_���#��W��#�_�h�^Ȇ���}��V��E�$\Ʒ��8�4��P[��g
:�9���"�" �sLǰe��F���'��r��@ޙ���?��rQD7��A��G(����Yc��p!��x���˲�MT[���Vf��a�\=k
 �J�.�c��߾F�lw�~��1��%�b�]��.��Oߥ |��<G.��{�X\������x���펃��0�/�����5O�o���Q���%�MBޯK�+&:�?w���v�l��� �o��<�H�$Ü��m������ֲǃ�w�Q�%Lh��a#�	9���9$x$$rL �����6R8�aR�L�D���ˬ����]C����"���b���/��6�dk�k19���3aS��iD��b��r�9٥L7層
]�]V<��p�%��b=����� ֽ�@kxg���t��8�;��py�4�b̃
z�����tLZ�4B���B���������o�p
��������O���$�ڬ�wn���0)���SJ
Y�&>tB: $��7.z^�H��������ˈ�ѿ���y���/��(w�G������� ��r����]��H�}���/`�g�G���W;��S �>rXlo��� 3���׆��Jϛ�go�Z\�/�:�1���l���*�[� CdG'�N���Tc5�g:h!���a��V�F\�������K��V(��`8��0 ڳ4f#�.G�a3�%V:g2����W$��e��@ҥp�;�=�\�{[Wb9�1���φ�����G�EFUv��?����I�����'�Ɯe�p��M�v�u�~Qkt���U*9>D�K��3��W���AnI�SX:� |�vj>����@ˌ�/nW "��1 �m�A�1��DX�b�)>;�%����,/��^g��S�	\�l$��>��������4�$��x-�s8,�����B���m�xS��OaS*��k�܌�x��
y_i�C����ȝ-�"I}1e[��M�ʅ3s&:�gZ����P^ZFgq��� ���v�%���z7
W�{����F�b�cK$1&��'��\�'��M[`����씩���f����������h�tg�p��g��p:��U7�yN��@��2�%�0�B�Iu�K#�ٷ�o'PLz]vn����v�BC~(2Ď\*6�*WNro;�';��L�'C8�^�~H�'M{�tk1�^�� 7����[��Ѩ�d�{�m����f�@4%π�ЫZ��f� ��؏��b�j*�cʽ��u7��A�܊Ʒ�n��D/��l�����&�鑕|�MJ����3*���ֈ����������!��<RA46�\sA����:c<VX:����Uß��TPoe��UE�~ ���qR�.�>��'ϕ�W��%g�>���(��j�@�V�{$V�^> ԕ�=/�e�o�����Q��(���>k��<cP�44`�g�\K�-��ex�!��w`��̙J������A���|�9�(K�Y^n�����F�Rt
t%o	ys��g#�d�O�Ò42AS������S?y�9�GK׳���MH��_q����1Q���T���'��4���3�).b��4&�����F���q{|��YǼ������L[/�	?�n3`V���Clg�-JV�[DOFx��k>�IP������i�h R����d:6x��¬�ӄ�y|R��ܧ7w�\���Pf���hT�C�1ma&�X�J�S8��CkV�J�mT�R@��=��	���C<�5�烌�e�7x��cȖ����N�P=r�)F�i�� Z�bZ�ӈ���n-� �⒘��m�0�H~��vqx`A-���<����J"�݉q.گ�.hh5������":?mɐ�E�y��du�~'Q�z��.E�#?�h>� �Ƥx���샇�v��I�Y�z�o���t��{%HmX�C�[L9����e�㋮��wql ��{b?���䜔|��|t��o��#0l���d2`���@x��B�q5��1���7��A���Uͺ��+�s+�2ϒ$���j������[��%�<���ױd}��f��H���y��0��6���"ss�����,e�H�\|��Ro��/��dϑv3��":���e�y.=���4`PI0w#]Op�gs�9�l��cI�KG��A�%JUj���ѻ�K�W���jQp�A�$�'��k
=�t|�G�'|į?�(� ^ .�SQ33 ٨�^��ś�`KJ���3��!����J����9;~�$�ZU����N���,�ɒ
J�t�<r��݃���Ȳ?X&i.@���~D����SG �M2L̨(����n�5F-K̜�O%������Y�0��8zKk�y���<�YA k;���$�گ�ܗ,>�}�_<K3+/���/\�k��e���!�����bR�d��Y�2�����;P*�x,B�^~ �TaH��P���'���*:ǧ������v�g�/�����
� �������뱼��4[[�k
���k�[�%��jD�^A^{��q����C  �L�4�n����\!`�5e�O�����+:����H����s]�b�5���$qb�'��2����ܬ���Y����{.k��T���1�lQ_	OQ-�0�-���qć�Oy���9{Z/S_�{`���A�ݴ�Fc�vg�S�zկn�(�*��p4G��И
|2��Ɂ4$Ԗxt.Q^� �t����9���Ð�G���J�$sAsC�E#`���� ��m���0 {��`.�$!��&��.�d�-mv��;���h�����lm��^���-5�|P `]��a0@W�G`���W���!�x�o�#"��(���σIF��
�YL���2��)2������mGib��j���Q{z����t�����@z3�A�v�K����#S�޽@.H:Ol�\WA��&� .�R-1�;�Q�M���e�ۊ0���poJf�e���M��d���� Z�膓�I:$ �t��Y߉xTN��U|��!h�J��qr���n�3������W`�t�ߺ�R��<N7�椛�ۆ��� ���۸��ehΏ$�9Z�]��v�R�[�6��^YĻ�Trd�@R��Z�h/H����S;ӱ�<'mDNַЪ+A%��)��ϳw*vL"�Ν��� d��/{�@I�d<�%k��$P�~�U*�l�C#Q�"�4KIB��b�F�������7�8��z��N$)��V�Q��1h���W�><�<-�QC.�1�DIz``a���ŇZ��]�>���
�D,ܴ>T$��~A!�Q�D�;�7��������5�q���!c��g��\�:�@�߈g�( M��N�G���R�B��uq@%��I��h\��3��v��h��.��@K�Tjut���H;��Y	#�T�9���l� ��+�2P{wv[�����༸P��E��q���p��m�� ��^��n���d��9`������8���#����D��ZP��D���>G�S�8H��1���=f��H6�k��2e9��3�Z�1��K���++a��3�9C�R�>����H$4�?�yPL'�g�d��AF{|>Քڑ_a��GP.�T���x*)99��\��q˯
@�_��[�����}ˣe��a̯-)��͜�H?����j�7���������<����͞e�5��@�U�y������;;��3���S���O��&�䌭����[���P��F��C�j���GY��;�撘V����llǩ�X�֢��}!��Y����\�XU��V�����Re%����,v��    =�	7B+~��f{z��� '��C��jy��j�`葊��|�]7Õc�����Ӌc�߿�b�3������Y���38S��ɨ���k���������#���f���|�~BY'��'>XS2�|����Ϝt��������2�����\��C���T�)�����������?SŸ�?S}�柁�RO���6�*�iKX��g����������~��䘐F�É���n
�n� ��"IA��L7`�;��V��M?���.��GC&�jH���I�g�o���7J)U�IZ3���<�i')Y�РX��g��Z�bS�^�e��F���H�h$�q���dJk� ��eb�4�С9�@�_�t|@�����18ϛSx�������3dʛf�
M[s8��_q!7����� �uq+�@b�E+��$�+��:�a3
d)��<1( �1�݁:'R�-?�-�������a��Lo��&��P/^&�1�&#�-���V��18h����(2�v(oPv��5�UHG`}^����G���oV,���A==-O�]{� z�$\2B'%���w���!˒1�x�,A�_q6��d����m�}�n��<U�)b�j����..z��褼(t��Q�5������P��Ē�c�x�y`Y�:�E�?�*]5�e1��7�'K��V`|��.�x�fI���$t����u:Ϫ�s�k;���7.��m��$�z)ķJ��E�+�8�,E�@��d��M�L:���g�SQ��dC����2�ƀ�6E\�B� �`���x����ǀ�u�r�\(J)̿�ԩ��O��V�R���*�qƥ��0 wL}��>��}JP7�"�:4��oF���|0<!Q4�[Q�Y�������L�
[^و�ȼR̛���oԅ�FL�u�|Nv��Kd�o�D���x���9��+E�
�����R��e�x�?�}�_�|_e�ҋα�]��"�"O
N�Q��ǁ� ���:�9�mƩc�O�aؔ%P!��=�����	� D��:,��ws�Y_�u��N�"��bIQ���p0�o�"�W��@{��������(��J��	Hn8Z�UG���%@�T����E�#��ga!`,p���6�$kw�D�a���+�ԧ(����s�+=�x8��
J���C��Z>D'tZ@��H�_�?r�b�6�ugl��������� ����H �NJ~��^�����7�:�h)���0ew�4����kb���"$>&:4n������}�"�iy�",)���B���A�;M�e&����{-��u�����̤Ӽ��� .j!��>]%)��dҷ���օ��_&jn�ܓ���6���\]����ƅ��o���T��
���j�<�{�
g�_�	\9A�w��T�T�S�:�d!�0�$
es{�i0V%O��q���7��4A���rɉ�q@���ŕ�Y�M�k8~
z/��}��B4��(�O��>�/̱�i��{�s�S���-x�j����-�D(���Q@dB������t1<0{�p��"�";/Y�����3iƹ�=j@Ab} �:I�;�u�^��,���~�O͇#O�*u��b��ӈP��Vo7�A�"(D��`�"[�C�����1�xn�+�����Gb�%%2�/Pî9�E���)��1���*�p��^=��(�N���Ԫѿ��P�I/����.�}�Hx�[�|��z�a���+Z0�1*�����f�NU��-<��(�9ۻ�@%|;A@b�)B5Φ�.Xzl�`	�>7�����)>��L�L�[�����#��cր���tN�Y�C�/R��߹�N;�޴�^����216�0�9!U��E�ZhZhbyh��A�(r��楀�؛O��n����wK,4��ؚ��ǜh�����^J<?/S�m-*�J<;8)��^جϝ��3����L7��%����}� )3tB��%��F� �L2����J���$�~�#��*dc�T����f-{ڍw��Q� <��t�T���V��
�� �7?���*�&����abV��xN#}[��d���k;�|JI1!/����(yG9��x5��1�<�=��M��nWs�����V�������LSJ2v.4��xӶy�!D�ݺn��y���ڳ��f��)�<5����JT���.���Q��d�^�?�놣�'������[��{�j��������?��`_{�8�,�F�VG9=��u�ÏV�� ��5 D|n�y8s�-�{y��n�G�GH�/b#FB΀+���b���G
nƾY�J�ې�[hߕ��>�u;��4�0�{ֳ���Ȟcf����!ڳ:�Ry�ᗟ��h��<L��@���v!�E�"�L\�z/�G��L,IK�1�'��H"�Ƞ:��׵����A��E���v-Ec�vV*��n��W������=x�����-��Ō}�O��x4��
`���u0&F�����f�(�Πp)���ź����Ǚ����d��w��Z��2Tt�\㥤�} x	&`Y=�2�ПSj�~Ϧ�R�*
-���"{�N�Q�ye닪���Öo���9��u�t	-2����-N_�Xvމ��n'������B'oM�$�=�!�KS�~����-����e4�;� �B����1��WX?	�o�7�B$"�D�7��c�E���h��ԑ3F1t��c������&i�Bs�\?���J�%��n�����m�4�[���0�`/�,���\��˔�N������MoI�n{��.��2��|i�M�h�Xd!���Y�Ɠ�!�U ����y���~����
��
^S�w:ࣹ?+J�+ 0RW�d|I�Q��D��-�>����e	����wz���3������!����i�^uuvc�z�n�[醶�52����Y��|��	�}�6u e_�C��M���D�	�@�@ƚ۲��<�K(��W{s�>>த��r���X/�Hs[�$ �^�h"�o�����Or2�4�������z5��,6х����$�]��nR���ju����ل0A/>�A�+�7�$��#������'���e��NA���ď�Z�Г��#�.B`�-��+��k[�1�2,��4ێ��$���&�A�7l��cYA��4����^⡼��6�/�J����c�Wce����e���1� ���A��2b&���j�,p=����Ҍ��}q���/(X�"Iµ�t����\�{�(L���υ<���V���kj<��5Ϲ�U�=�ח��X;8�X�5����9�d�i߮��r�$�
o��>[x߁����������	�/���k��!5k��;��z� ���c�}��Cr=/Y�8L�p�5���>NoSX�F���[�j��l;{H܅f�&+�ZQ��D���-�r��J�H�e��=�� ��D���q������n������8��_EZ��DyJK�r���4�s�$�SY���m���h�n��������mz}�T�WH�3}�;zk���T����2Kr�魦دc��v����ˤ��t���2�Q�� KԂ_ۡ�%���={/4(%��$��
�}����9,=�|���g�KZ�R�u��E�Ů�1t�L���p�(��JX ��;nm(�_���4�[�+����>EM:+���b���ygz��*���&�}���.��0��M����03(X�'��8�mod��T`���e?[g���^�@9�G���4U�f�n�@��o���ˤ�H:1�Mf��ʄ�.�ؕ����M^���"3��6����`hҌi|r
E8R�p���j�c���D�e��E�q48;,[�8@I��O/�I-�����p���V��5 jY�������������ˬ�橕��n{Y�R�ÙX��&<�L8 �!�L�YM�S}4���hҎ�	�� �A�Vm/ p��X�e    Zv�[Nd*>)x�N ^:�sί^���R�G�k�b���[�D�GA?��(x�f�������f��{��V�iw,H�y���8���h��J�"�U���ݎ��-�ͅ�2�`�v�������,`�Y�
KnJn3���-�2\!�x����m�=��x(>�Q��<0P>!����,�ܾ"/ݢ��l�騳����������u -�A���z:��퍹`0#U��>�Í��$3n'WX��&Fø��i�t�55~N+���K�.'_�~���B_���[��yS��!����:��רG\x*���>1a�hPoނ�����πMt
�>`�D��V"���)4�݌nT���=���i���Y+������)ڕ���|���]��w����@RM+V��dЈ���AD�+���l�D�������M�y�0X���v�����F�����߂�aQ.2	������{}��+�7ɔ���,��(���l��JE�˖D9�Gk�c�~	��
%b"ep(��.�%G9���{�ǝ�l3l7L� A����°A�>0h��ht�@��D��b~ڀ�ݡ˯ԍ7@�{8���]<Vo���zp^�����81?���9���^KK�$3�6�q���^[N�����|2\Zn�b�,q<2�\����#�n$a㵅��ݸՒ�J���xb~�?d\�Uv�ǌ��W��e,G�E6u����y$˪tWx@4�YSx�zx�=�W��~Ehj(B�{T�{�Zߢ*��P�wt�%�`�����u᥌����t����$f5�q%��H��Y��iƭݷ�"X|t.o4H�1�B��h��a8��]?���Jw�>�h�$��Vo��A>���2���U*�V���=yY�PY���v�D�m��x-�l���
��=���&Bn�x� ����gD55>�$�����m�f��+fU��^ߧ$#Q/�a"܏ݾ��ҝ�+2�Dr��	��z0���$��n1H�\���=�B���E
x�e�(�tk�Miӎ����bV�V�W	�<���D��pĎ��~v�١7���ͮ�	$ĸ��Z�;�mo��lH�=F�2�D��:�R*������B>wfka뢞񾢲��#Q���Y�3 ���w~&�"��a�t��И����i�S��}>��Ř�|-��)O��^O��.�R_�u�j�a��7��WCP���'�~��~��1��PptƎd@;��h�֊�w�U���Y}ٺP�ݾ �C��&�a�n�Yk�Ugx��>�dV�������r��ξ{:j$�`�V{��S{a�/�Ԡ�O���^a�;�ǹKM�4NBw��|�}BG g���yk�aj��7��]>��\!��->-�?j���$�^O�%��#���p�	��8�6{qO�&פҎ��w�,dj�!UC�� �P>l\��)ԓ�߬Q����79���eᖞA	���T_W<,�vёg�����Ds�z�r��d]�c)L�tu���?�&X���O\Bp����b�y���A��� 	*�>CK�E��H��H"�@�H��Q���n���(���Y�_7As�M�)�G�c�l�,c���E�����![��da���H?�j���OǩB�G1��.�=�Z��7���$�T��8�_�0�҉M4�����b�U�����꺯���~��0�&:�.��� �x�	���I���C1B5��oh��i���^U҂��p9{Y�5��4�)b\S��M��O��D�~x��{�q_
�l�\�����-�v	O�!��ǩҾ��\8�Q2�|0�֥vV@rsd6<�	�~\8e��7�8(�rt).�{�ޓ��I[`��ɦ�=ݚ!�� �3@hG����z��\+aV," z� }R,���{�E�9�
����r �z\C�f������T��]B��O6���K<�c�u+1z�5�|��=}D"r�
kĵ�����/Pkoe�zD�AB����`���N"�܂�7̝@H}�%>�W�v������N>�����F!�|�e�C��J2�3�H�C5&	�kIh�!.J��Ǉ "�~+;db⻻:��Q��pss�J�-�!�&�1ց))K&Z����oN���"��~��*%uh�����E��(O�UңcQ�fA�t"�#Yf,�b�8�m�����Y��/:n���9mup�灄�0�m�g��^�?�U�e��}&� �u=�Y���)�;#v�ʊ���.�p����:��Ԩ��[C��@*x(8ژ�(�7$��0k�u��7؞�$ggu}���5q�C���"M�W��,i��p���Q���bp-n&�/,bQ�,(�x�C5¡K��fK�G'�oQe[I�xQ|ҭ!l���^�;�`Dy�:�:[��@\���H�$��e�u��9U�N�p�(e�-=Q=EWv�W8n��5�m5����Q���^�^�\v�-�*�{���H���H��\{��@�L�s6�����L\n=��l��?���o�K]K��4���W�};�,U�� �#/+��N�|$Ua6�	�q\w�O��eמ;����DB�*�=�G#��?�{s�T�_hЫ@!��]�Eq{a�L��Ơbi��=�������j��֋"�d(:�cJT^�ɐ|KM�D��T����h��4ż���M�g"�jr����"�|��?�LG��-�7'��w�tCQ'�
����� P����§l��v/i]�� Rae�Ǳ�ep���*˚*�� '�h�tg���<���u%��h#�t]KT��Κ�奙��i���ȍ��/EP�1��Xz��k6�w�j\�iR�������~ +�N�K���� ��`��Ob&��}�A���N�D�<&q'����!����_�8	�� ��!-c�ʩ�I�j(�YI+d�4C���sъC� mz'���
`>���":ɟ���/����e��0ά^���\2["؛yVm񍮼�����ԣ�?�rޑ)[E����
{o'�^H�\�W=L��^C~2�oqM��9C� �8�@�
�ɺU�]�1�I�h�(��.�L$��hP�<�?=���3�~E:!��d=4/��h	�E�>X�b�9�Z~���L�e�X�|�ֶ�4Tgq�!�N��[?��xa���DV
���#���ם��q�o������m�`�^�bM'�n�np�N����B[�@�op�6�Ox��� ��Y#�B�kt^j�vJG�IK�=����|�L��!vX'v�^�����V��P �Z������ \q���Ы�s�&/fi��-�p�(`��eAC<�&w5��iۍ,��S�-p	W3���m &�l�tY��� @Q�^�	�lo����Dvb3��v�:J�F�Џ!�Oz<C�t���W�A�a�6($q|�(qz���d�Ss��Ya�E�U�~�����V����x9��W��>폗����ᅜ�,��E��ӖkB�[H�*��43�v䯁 ���~<�4��Z�cK��Cw0�Ɋ!v��a��{��mp0�D/qiD]�(h��}kw���
�N��_�4�_&�t���]%m%���S�U��[��p1�bEM(�G�!�+[ G��f����P`�^γ+��@Z��${��-�'�Ơ�Ưu[��l���޲�L�L�&��)�Q��[ǋ�#����!p�9��/�NK��jo�P�����P��8�q}+��E�j�|�5���,OL�^�����H|�r�*i�x6&��.G;M���3� �9��c���5l�@��,-8���;�_l�&8Ρvr���,X,�'���Lg~?W�NhV�b-�y����%����V�=o-�����c�(��\6��֣�4&ǰ5%job�^��縐�d���u��R��
���N�]�:n%�ӽ�����;��n�a��H,krx�0������{s1���;JMrH�1@����h���)����C���8�R�j
�y�Y�����T�7�uz'�By!�/n��B�GF�*D�~գ![S�y�O��<�ˁd�@    ƕ���5�zd.6,��B�����]�]��}GpT��pDq]���J��Y��4�v�NMr�_|��IV���>|�v|ϗ����{�^ץ~�M�^R����=]4B��a��6���\�!��'zcd��p͒w߹U�D�n?8$���zE��b���w�$��\��B�d:tб&��qM�]�B�(��M-HL����=��zQ5M�N&�j��l"�L�Sh��<�]
�{%���N�R�$	z|;o$��������Jt�i�šI�z���U���=m�().�-dej�@.��l4����Y�#?�
S}x�����Z�3/��Y��:4���60���Q��B��hr���bH���������Ų.���`B"�\%�?��CG�涘�X����K�0�����V$}�4���[Rf�;�Q�H�v���.O�ϽxYb�z� :(���/���&R�j,�o��/�:,?�|C�Ť��(E|&@皅 ����n��Җ4$�uJ�,����V�(����7+�z�'<�1��7��<%�F��&��!
m!��%Z���[1:��Q�<�2^��������'�2�o.b/4oMv+@�Ab�]��A����u�-w~ui(���l2!�>����N<A�'�UI�.��~���n�||��d>��_pP��h���5�!ߧǕ�J�6�7/P~�o�+�D�ON�P�fB�aY��x�d~�hr\�T=S�4z(So�s�i4� |��ױ����Tc�s�r ���fhr�������e=��M�i(|{l]`�� K�����+���^F��yX{4�l�K�F�5Մo��<r���{��2��8��mƁ�,Z�!��+UA���8��}f�� ��r�����mjc}�q�m��&�+G?������t����yvG)��`��K����Ȏ��fPU���0ײ�^�K����I����8�ba��&��pc/���T��0���ޥ�׺l35!L��� �;V���}1V%��`I��5Y��EqC	d.����#��r�XMz'��B��p�ȜO&��Np�1!��8�$�.��m��1<�����L}-%Gݓ3��Yl@y��ߐ�S�K
�w;���}�~���@�� w��0`�F}W�E�s:c݉3ҟ6��� }�+���g�.\���9J��SWO��[2[ܧKv�;��[�5(`�+@7gQ�Wr@�y#�9�Gȉ<Tcw�*�5:M��`�>/=�D��b�X�cC��~��d"vC0|W�0��4�MǓj�&�-�a/���dl���c�pP�)⭡��:��*6�$ާ&v�N�=��Vba�7������7NO�ւ>�(C���ȡ��
[I{J~\͞k�{�8"2+���}ya$�l��-�R%�Cm��`���t�g�ʒ51�ގ�[�4�u�O�Y+O�l�ƀ��6�or�3_���9�]db"�]�(��7�]e��٣И�u�.u����c9�4i��Q���zUC.F�ȶ|�~��U3�������YdFd�!�ϟ��L��vu�t�
+r�vXzl�H�����D��ō'!/,YLZ<� Y'��:C���["����"�^�hْ̬��t������J|�}���zQ�"ʡiA�g���V�N��1B�y'�%Q�6YO��Y��{Q�v������(��77Oe��>N��f�[�!�)}���s�;c~8%�8���2X-�㘉��kT�x-l��b��kɤ�?cd�}��#L�c,��jsv��S%E�8��,���O3]N�e��5
w�%�I��;��u�����_Q?�7^��+�d�t6&)��$�ج��4se+(TFM3��*���لV� �CW�Ylț19����g�`�?�2Q��+�"������7��;4���[��+[@����/�/����5��3�b��	N��I�{��Y���|��,�;�}�����gt�#ݴ�O���^���B�B����BM�
�̡"�w:�Q�w�S��b�pP.��X�/O��>����L����Im�:�x6�G�7�`r���D���_<)ל�P�QQ��{U�f2��41���4��nr����ߥ]��U�~n��M^�aB�X�����Z��L��є%{s�jHl8�}����ˎ�uSj�>��?�x���_ElR�1�wAL�O�I��z�*?%��S��5G, 7r1w0����C��1�Ȗ�b��F�]�_��� &g��B�`�(dS�K���с��Fry�a�{~�#�c��jֵ�/&�a(6[����(�i�!�#֘�|�߂TW��'A��m<�F?�u{�*��M�eCI��޺O�M��J�e	a�����]��?�^���p'���Mi�<�~z¾F�Wx��|U<���nYZ8y��0�b��4��e�V�"���^ �҂�����J��
/ bdm��G�@x�{un�
�%)�6��dxȋ<q��+h��	�F�����U�=����H82�����^)\Į����A��y�~D��|l4�
#�ŀ�w�	;QJF����_}E&������М�?�a؈�]�k�G���=����*�����D��`Ib��V&�)�h<.�'�ր��r4�����T��/�9���V�	��Ӧ-��7�����E_!���q#���G��fTIz�i2P��d�i:���ɐ*��b�e[(�2Y԰cxF�2���.,�f(6	tc�tN�y豆a[�9���d����=��k�}eO�V*�#
�C�h!.,3dy����0�1�.��l�i,����1z������9�f�����^v�>'�+^�\�ߺD�znh����u$3Bjn�p����<�0�E�2��[��=_���Q"@<ۦ���c06gGa:�r��ݭ��
�P�q����aE=��=�_$�,u&wA�3�2`h�`"#�!2�桫����b�FD�����4�Pz{���c{�rqgA�IZDwhsL.Q�i��A_{5�hF�%+,C�m�Ɩ��:�t�0(��]�.O(b��Z Nx�/���o��(�_/�pzc�SD� ��zܘL�+�Iݛe#r]��i�c7�.�Q�h>r�����tg��|��5�}^�׈xt�f_���}�6Z�=�\�tg)VS��/�sYEߟ{AF�u�[���+��P���9����B���iD
�S+��h�{}���Ix�WG%��/�o��.�Ɣ���@�'�B��_����T��%�*�����5������<�ݰ3�{�;h�z5'A���U��Jʕ���{$Yt:�`8���g*"�^�)E(0s��D<C(ϗ��a��^�'��O�M%X�0����x�D��ѧ�X|xEG�xo֍�m����2�1�Adƶ�(��-�S8c�<���'P��GB5A�ZT���A�:g%wH�B�։|O�W_/�����)'KL�]��)q�؏�$��� ���O��H�ĉx�/6��:��ͯ����߾�%���1��IkH%�����k�������9>�ڿ��^ w�/�w�v�岳@~��u5��昅w(�$�����z> W(Lߨ��I�:9�{������҅Z�LN����a���T��_Q�@h�4�v��U�fAV�Q�^j������\��������a�v�����ہ�I�gY��4+ް#�'=���� )*]K����o߰�#��/���)`���c��N�[Pш:[(��=����Ŀ��]���ɲ���5T�t���� )`7Y�H�d�@����bBn<���D-0J�$������A ��m�7n����{����+�Y���?͋��T�X8��?�

逈cN�bf�f]bC�';�4�c�>a��x�:k�]5�OMt�2���*E��́Ȁ	�@CW�:F������@�>4a}�e�=	��^BcP�#��(!��w��yr�=5���a��b��\a��DV�5��]�ॻ�x�����+){hk�gm�c>p�G��S:^��<�Z��^k�-�П
y6b���7��� �I%��H	~��7��l��"��v�E[�s�'��    ���t�������p�T`a#r\�;j�J�����&�Bvy3� }�r����Յ��n���n,3_i�� �G6� ��K�)�u&"��
����UX�7�Ƿ�Vl�R�DH�I���`�����x���-�>�6�y�∡mcl'��J�Bg=���K�<Uɴ�ͤ�s&�R�&�6J3����^�����5��f�#���*υ'�HӍ�:0ʵ�S�@8���������9ӝ���I�0�	�$n���"z!�d�AZJ��܌?�M1E9R��d\A'�����e̽T��P Cqt2A��|�$0�Y�Q�ڡ|��-�dӍ�۵��x�������'�((��hD��yA��-}������[�}z��O0�@��U;�!(��IJG�$j`���%9��
��Œ�(�1͎d�c��&}��K��
�0��nn����y��W�0��	�x���E/K���.Pf(�]��-*�� <YD�}���P��*�lrl0� D��s84�8�L��SE��E��s�K��^@+��%jM���;������e#�5~[����/ʽA�1s��1U��vc\_n�;$Z��cb���M^�V�����&\�tþ(g�d�9�c\½��ٶ́��~A	<l1��$�cR��<_����;�Z��%�L�:�����dRY7(P� ��e`�����#�Y{��O�s�I��@de9�"���B�<&���WK���-�p�*�$���љ�~|\������f�D�g{�V�c��8�/;�ч����/�/��P ��G}���o�9On�t����7��{��ݍƍ�����.j�#�I���fR���pY%3) �	ȚN�/2~-v�z;�v�%y��!���A@�'��x�v��O�2�x%8l�Yq
��ms���XT4��XN��Z�E�p�q%o*��\�P�vF��BM�YǱ�(:s�A2����(N��\��6�L�)l��&5�Kw�DiA���#���2�
�[��b(�����f:�#��
��@G;���Ah3����ُ&�)����~N@޼8хpX���+��c�IHJ	�� �)��1��Z��"�ŗ��f��c�'?$T�����}�!G�
�k�~>]�88Q6����i�F�g�9�\)�74��Z�5�+E��j��k��s���DN
�#��Ø�+B�e�LnFd�pY��f�������[Jv�zfE�|]���i�sӜ�ཟy�/)�$	a>������F�Kx�����YL%t�f<ÆvcBIaz�(���y �I;R�
K�2�M�(łr����7�JD)
�+���������c���l/P��Уey��a��y?\D���B� �~J�d�ja2&�?�l�;%�/R�0�Qx��� wXK9~B/�H~Is�S|R����j)FNގ�����=8��-��G��.|��&{#��_����H�X���:=���Mȥh=��b���sp�е����=w�x�c�݁�;��x���3�����v�!xN�`�':7�J�b��P�hh<I�yA��J���EK�?tN8��+aPIu�핍���D����C��&�B'��)�?#�Kp3�+�k�7��NN�c<EҖ*ˑ�*+P�Ȧ#ڤLԑ��O���� ���>���[Ǧ��r�힆-��(=��.���?@M(C � (���/�຦�[�7u�]��d�<�6��<�r	�e5�ԇmo����.ŭ/W����񛤃(�`�bS	0�^ay����}�lz&�̏Ώ�H��)!�NԗD|FȰ�@��wf��-s���I@M�5����h��{�d-��=)�H�g S!Z���V_O����i}2�ɾŎ�]�#J��,�߀*�7CwMV�$�n`ѿ��6@(9���1+�|G����ů�M8������p�f���+�������oڋ�O�
K�U٥�1����������";|F" $_�g�Q�oF���D��i������D��^�qr����gH��@������_ٸy_ 5��:�+��y��w,��=�us]ч)',`��!rb�~{͕,$�?]{h���S��C��tU/�AR�#B!��gM$��sJ��!`��W�����[',P�V�Q���tፚ���ʛ��﻿�Q(��NExLb�%���"߄^l�����%<����'��ݦAG���%�A�?����KE�5V0\O�~2�
[�kM�)�-h��T��(*O<_���뗨�F+�=����pz�|��I�X�����~���6���6LA��V�̛/�`ˎf�$��d{��LS����n��a	";�b�s���@�TP����Эe!yc8q�=E���0?,����Y6�QN��ׁ�аA7b�IA�s��[�_�1��[��-h�V�"GVh��s0+��?�~�'��3�+�����������������H��w�e1���J���ӂ#�\���.jy�8n�9biX"����>z�Ά���X�򗏥�8<Ұ����<����b�5g����Q�4����#ޞ����C��M�'��yl�آs>�i���?�m��@�6��j4\q��M���A^��k��O����{H��C��Sah�=l�zg��g�c������ِ���3;p�-�a�v4(�7�y�ۄ߹ʗ����wH/6�E��#h&��<�1�]�7�kf�ЈܔD�������g
&���B�/"�Oȝl>����I�7^��=�1�j'l:��Ȭ�ׇ�sl����-2�6��AƖ�E}' Z��n��_�uSp�p��S����b����R��aϮ���Cwz����Y��~Wͥߊ��C����1瞄�<���<��:�y��+|G� ]���Ѥι{�u?��1���$	��@a�Y�d��x����ae%��D��Q����[N}˶��A��~Gـ�?��~��gS�j#�i���ܰyu��)w��S�`Q1&W,�CS�rg�̈́��N�3��d�@.&s�D��g?ʽrAnM�^JH�k�/���ư����] A4����g������eWBy����#� ����A+����)�Q��i�����:���"_o����iH�ߴE���钳�D��I���7ƻj��H1t?����w�{�����-g4��JV �_#Sm�k���ވӔ�]�^}��I͍<(��!џ�/Urh�]�>K��Q�e�.�;?�"��f4��7���ؑ�X^8��v�.����U!v��p��p�������������վ�D@��J�����hk��	j���L 	�TgH�&ZU>��֓�W�k�����oTh8��B2-�=dZ����3�d�?�n�)w�3qIjߟ�.�����)�E��}�g6x90_)py�fb��Mjx��PyT��3W!ny��"��ނ�x�͟�P���e6��F��s:z�������;�L�xΈ?�\bC=���R���o�TO��Z�cI$�����bJlٱ�;z
�A�{Տ���^��Imb]�UF�MJ�w�-�HƔ��CP4��f���;un��d�������ͅ���68g�l��N�K�����������Fn(�K�X��1؇��Ƙ-����=G�*~�+����88�?�r��0�=�!��S2.(<����X�#��Y��rب~��љAw�I�;j#c�����o �{ .8�����%�5�� �³�x�<�t��h�t
RI���4�ҷ�$r/�X�Fك��1P ﴃ�M��ў�����=l����f���K���ԽN����H��;��r��Y��o�NI'�ct �%kQ�"��6��>�$|a�}	c�FpǼ#��zO��p�8%���+{����gUһ�1sκ���Τ7�H������w����F���ґ
�m.	#�=7�M}�p0G	`5fJW��	������U���l-�Jz�0o�<�~	�`m��$�>��_�gdQ�oG��֓�"A�1��m1-�    ��dG�e0#` ;s�1M��s��2j��u�e�,3�`=\�S����+4�N�I�d��J�"/��&\�S��i�[�������ʠ��T���%r��Y	�1���ďȿ��4�����e��K�]i3E$�,���D�z@���|f&�2c�0�BR�v��8�/<&�qQ3����?��w�0*�7ܶ��ş����m�UJÄ��&�ܛ;�UJ���Ga�K�f��u@;7{�}4�hXĊȧ�u�8mң4JYI��l�o��u:7��!�;��w��#\<�`��}�J(�z����R�L�+�֌(Gц�yE_�
���ec�=�oB��qb�u�S�uBN�3r�&����`�bp�y���`Zy�__Pd!��9�����'p2WQ9Z�Ί��d�
o���f�<��]�@;�=G�RVv� �?ܦ�u�d���E�ҦhE���Z�j+Nn��t,�ƫ�� l��X��Ų����h�|`�&q�Ζ%�_��&��!���=s�(�(��"��F��G�x
)�.�mf�>qKP4�]�:h��ukfAF>wgzU��`�1�p���L�>��j�*�AT�r�[m�� �q�'���p_�u@MJ#�������;Ŋ����Y���c%jzo�kZ'
Ŵ���=JԬ�2��W��8�<>X�-R�����G��0��ZP�Ķ}�*^������́����zf�a��/Ί8��F�{����X��_���������vsA��/r��<�h���t��
4sl=T� C�-D�rςv~�	2�ý�Ȉ~�eU�(���&)�%�6���zsBq�d4��!w�Sky��P�*�=�Jq-!���m�z�ybZf>�{�Z9EP�X�)LFC����9���{�.���y�wi�䃤����,�	J�qrq�x�g(�����Y<�pa�z�ó�xՈ�-�iF.���Wk��S��:x��3�})ҩ>7�+4�*Y0b�`m%SY��a��;���a�-�~��(�
"�,x~-�����nf�t�,���6�w���P�I��r��=���a�9%�.�^����9�Mk(x�Qf��\:6
J_'�&K�%����2�	�K�)�W����;�fL�fd��܌�6a|y_���#��A�����T@���_��S�F�['O�Lm���4�l\�s�f���o?��
��s�d��s34V�X)�0�,Q��Ԥx�	I�� �:� ?w�3'��Q��F�k=n�!,5�Lv��Wؘ	.��2�� �����h`g�h��3)���G'��J��b���Q���
��"���7~��S��o��/Ä ��ox��E'�LMen��+�P��XD�m��p2$
A��.�d�hb ��?P>�}�a9QuE�^�_׭u�q�i|A���f�u�f�0��U��@�$�#"��؝����w���u����C;2N*|�����E�қ�#��Eb5<�-)C����[�yd����WA�B+c�$�"4�@B4�~��13��c���Uy�;de����o������t�yMqjA�b�ro�%��D�xCЋo���O?�o����J	��5�B������IV�d��[������mLu���[�B����~�z����n]Bm<�.t��\Z=#��8b?a�=�oN����m4/��,&,|&�YTl1?�d�Y&SN�Y^S�qh^���2����oG��
�R�8@��������8��t�4s�V2�4)b^t�^2�,��F1���&h����l\�������#Q�i�,^� �~���_��v�`����3�2;��:�t���O��<�,����$x��t.w5yv�=6I^3�<X���V�^d�|�פ�ވ"�N?��^޵�#��H��=�w�~o1a�^'8�K�@�h=+�j�<_{j�I�́ʉ�-�o�, �j�g���|�~��N��B�ɦ���O^�׾~|����*��ܰ���@r]���:!ϊ�����s��x�mq�]-�4�UvφM'S �n����	�:�2)YD
8M@v36yFB�o�b�3�-�,�������"��z�m��1L�Wj�'�b�sSQ~gd�0z����Ŋ�]�b�[U�bf�&3ߤ�V����[芮�QY$��/�bLX�W�d%�?F��ݒ�E[0�#�Xʺ��X$^-g�q̥�e���W~Pp�o�	Jew�6�r_����_`#��Gs�>~a�1qژ}��g����v�E�U�'��C]4)d�d��}��ٌ5��.ȱm�ꚛK��C���X�Y�pl�wF*PN����=��6|�t�i��%�B:��fD��z��[so��� P��
�E��bO��d��"<����Ҿ}����r`��	� 9���e�'6�gXy�X��_�`�~���7� ����;�,�&�7��8I0�P=�N}Aj��:���o���W9�E<��D�H�"�
�s-X�g�q.�� ��ӄ�/��a36ah�f�7(~�!���$�L�x[��Y�Ϻ�Ŭ���3bC�v���=���u���ɺ�J�]�55V1�Q�͸d�dg��an?��x���lM��+>e29*� 5���Hg�+6b� ���.}3lV�PS��D���zWɦ�"�~� �W��p�c�7�~�F<��C�'�����9G����@�Ŀ��4nJҚ'Fݝ��t�e�p�l����V����&�z>r�	%���6影�g#���O�.��M�d�%��<eYv���czJ��m	<I��O`���m�!�5Y\��	nW��w\���x���K
��[U6����u�Cu��oT���L�#��p�Y|Rd��s�"?&q�='B�߱F��<�3& ,�!TY��"nߤd7p�D����.��VY}6pt�2��Bg��񄋜�,r:��8.y�0f�H���-4F)�>)���K}���5E94���� =�q�lv�/��o��$x����t�bL�j\�*�K^�7�R�� ��s�w��qL"W Zt,c˩���2�9��C�\0/@kϻ�Y��b���
G��'P�7	\?I�҇���X<7��BT�%�0]�ȝ�ʿ�Cb\�.H�D��(��Ҵ�"��ۓ��U���a'�f�����^0眼�Kkы�����q���>�%��A���1tU�m��!�ͩ��?���O(P���ۿ�T�E2`o�΄XX\R�B!�\�&����ؾU|k ���G'#�{�}�g�Q}k�͍q+������ɺ�+!�Z������.oM�bp�����V`��٨��z�I�![�%���4K���Q��ր��������=��ip�^���x�봰�<��Ē�����:[S̊p4�/w�dҖ�a��|��Q��z���_	�K��ҋg�脕ֶ�Ş%�Wگ{��8C�_��|�26� I�9Ĵ��xHC�>V5�"Z܅��mnג��9��J�0ҧh��s���$�/Q\�����l!R˸�8Q�d_��l_Q�@�Q��i�/X��\E>��pI;�P��R��N�:�%sv:��w01yH7.s�r�P�ks0�<3����I����ӂ,S>�2oū�3���#j�5P��'����ã�	l
�Z��Ҩ�&��|\ēS˃j݃�tˈd](P}�.��i����l��_�~@ٓ�*��;���x�N+H'^E�N�#�9�����-�SЗ���gT:d�ʓ��@LB��r�Q�e�l���%�N��h��+_���!��:w_CL��ͳe��k �do�������^��3��<�^��n��uw)��V�*O�Q�Vћ��봒�uf�E�����{��'N��9��t�w�S1�k���#	�,�t$�ī`9P�<ҭ��2C`8�׍��/���J����wDd::>��f�E$���z��̽)��� wjA����"e���,/Bd/���O�
�E<#	z$y��
"�(ԑz	ʐ�[�|KT�[��;�t�Th����=\I�uP�\Kw̄$i�4��,�
�+(IV Q6� �  �\-XƜ�dٚ<q.�]?�^� ���/��IO�pP�cѡֶN)4S���w\ãYs��]'�uW��r@a��]^0�M���e�23�D�*\&M������_�đ;��K�.Rs�:�$� �z�o�?�m�)M���>fs��7)~j�ƣ��c}uK�6�C��n�l�&�։9�c"��G��$A�SZ�b/�C4���S��jua�D�����g{�-�b)4^�:�R��j��P�:��F�ϭD�:]�[nj�y��q��׷��ne(��&&����#e��#o�9.��Ļ$�\5�+D�-�HEg�����lֶ��~ĖS1j".˰)��za�����b����R���jOy�w��*W{Wxx�4+� � �HF�4��f�l�$�܏��!:�'�ԝ��ܗ<5@98ɯZ���3ߛ�L����]
$�~����଑�.�;���̅�Xjk�-0�]�JnEg�G�se�0b!��6�e]2b��ݻ�����	{���k�P�ˬ�.�p�	��31�{>���U��Q�z���(�9�-�g�����P�:��s2��Z.�Gxb����C�L�*lHDh�2#��N�|t��:!����Q�f��d��s��G"y�Hʮ(�\$A6�p�r	� Xh��d1�x���e�{s/us�@�W��)�4�Q�K���H��'�t��5���!����kK�\e�#v�摴��j��:�����I=�;����P�#�:^�z*�[�@�k=/1��hˊ�6޳��"�S[KQ�p?	M�J���PK�F��̓0CD��l����^�ܳ!��u�7%����:��5fF�yE�V���,�\����v_0Y:$�h��Q�H�!��P5��?+�U� �s�tk���:�8�8�k�ȽTԏ�������y<����j�|�Ǔ�!v�b(K%E6��qU�0t�o8���q�ءF���\�6�
(�7K�FXm7�XV~�P�T����s�mxBPt��Ԑ�g����U���-��"�v������0ŷ�;���_�=���F��(B��|P��:�	x$\��J[��v;��^���=�Pf�PG�U���.(Y��l�h ����KAo��;�Uᐣ����^/�u��ն���P�ǥlr��M/���:Ko��>â�#]p%���O�4����7Hs��$�Iޙ����4�ƫE�y���"���>W��vO4�����������~���Y���m��~+�3_�`��ˢ��"a�I���t�ҮkpCo4��h�èw�V}�^��_��:
Ujő{\�a��k{[�l<���D=M��J�o��^;�&`v��W4�kӕ_	ɲ��T�i.ۤqW���4���u#� �#s��^+�V�i���j���y~�q�x����Ӎ���/Vb(�]��a!��`�B<���%�y�h�x�Kj���ӌ��^Uk2�,X�6�c�C�#
s�ݻXk N��~�ߵ'\�QZ�Q�#�]A���<�z�L^�!2�w��׻䚀|R�����}+ظIu�|F�{�S���WO�S���;%��O��8���������A�7��uL��Z��
���lz���['T[��
������g��OA��:0\��c�j��[͓�`Ӧ��>��*귲������S����=N����n�ty�c��=Q鰉�|_�zח�6o�T�l�}���%����Q��H\ �a����:��h�|����æ.�q�=7�ɘ�<n;��������������,1qёQr��P���m7���<�1�+��c�{К5���(�'�7�W<n�¬o���	��'u�,��pOvm�t��A 	�s3�2�P_��ԏ�Ѩ��(p1br!W}8n6/�Yv �U����� J�䍗�5N��,��>7��c�1�1�rc�G�7���ι������$�b�C���I�nSb�*��Bn>�wM=�V,�g��`)T�����&6�^3�!sBl+ K�#��������^<�F�"~XY�<k�{1P�WQ�� F#i�s��Y�q��¸��\��9%�b>"A��I����cV!Î���{uE3�՟b��(ˀ��9-�Iw�����7[����E�б�ˍ��+���k��=��	L�׸wx��a!(����fsQ��Nk�fe�(g�_*�Ad#�;r�./@�+l�g��C(b[�o��vTm�����p�^#��ӛ�N~f���,�(������y��7���Dv�D���D�0jCb-������q_�r����p���I�5��=Wh���eQC��k�3��$;ޭO`4A�L���+Y^SX4k��y&�h�{QdG��c ��K4@5VH��[�2����5 �dC��n��O�og=݋������T['��7�3��:��:���:���5���,#}�}�{�a�Fi������d�Y9XA���>������"��[V�S1#&%i��.eoj�_���IGNRp�.0���o�|f�/vZ�؟�\����zI� ��62ـ�6��wN<�LQ�0�(i[~�(��z�J�����NBϒ`��3�|J�/�	p{N�7H)�}�[�d�{���q���!;��N�pr�`�\�lp�n� �k[�@`[(qW��dT��ëW6�6,��&Vf��1hO�/��Sϖ(J/gF��.���l(�⃪���#�NO����ҙ`,)�p��.�s
��������/8-�>6�vp��u�W[���d��M �ci���g���g���p���U��lv�^�h*ȋ����!lV��zb=�t\oٛ�
�K"�_H7��0ދhq��|�����y(�8����-�/���%0g�6p��/|K��yf6V�m���#��թ�������J-7�����lWY4�%���[c�n�.���E^>�N��L�����W�^%���p���b���w���փ�I{ˉ:�:U�lD�7�m���9�$K�`]^[������EE�׵��4����_A�c�;�!�����s��]�́��{Yt��<nE0x1��~�eN��騝�N��� Zc����۶�g�ӌ��{�WB�t���8��i���J�u����	m��_z:�]�l�ڀe��!S�ָ��	#�GՋ]�
"m�x+Y��_]��;kV��I�����,���QV#�Dw�f�Y�M�lf�vYj����`�����җ��t��	Pf[bV(q4>+�c�,��dTߓ5�hJ�;��3��Ѣ?}�Ӷm�qd艹�D��9����X~S�C�����������)�ڂg��3��jD\�n׃8�!��<�Wo��t����~l��P�ɻ'`�nS8	���:�~��E7� �V�n;49�t�X�C��\YD��yOF��P��|���|�ֲ�|�VjՇ^7��ûЫ�ޫ��+�	�]�,��)?]���?�HKD|��͘�V�sV�?��s�ß��џ��џ��џ�����=M�`��Be��̪�z�v=�R~ǜJ��ƾ�������׿�=�{�      2   �   x�M��
!@���+��O]F�n�*�j�,�q��"��rHB���}J��6��lj>\�]��Xn�X[e��R��%'�C2h��WJ��D��Fe���80BX�C|L�?�1�}�����/e`;�{d�*�      4      x������ � �      6   V   x�31�47207352�����4202�54���LKNC+��\]#.ih�`haebded�gbffh`��XPP�_������� �z�      8   �   x�%�A
�0EדS�	"ں鮨(Vۅ�Rp3��(&��޾y���J�-��!�!�4,�,TL݊^367L�f�0A{�d���аZ���,���:T��[O~pV��~^/A�2��R9����^��~]q�1����ʠ�v��_m��x4      :   h  x���[k�0���_��$1&�Wke�v�=0�	4]�����KdB+�Û��o����YD8e� ��ڭ��9�
^�-,W/����2�u�'�;ûj;�T�R�}'+�,D�Ji:�dFؐ�a���&H��"�a��v��Ͱ��?�+�<���2���+���Y/;�}�tL}�c�b�.��荑G�P��U�ʳ���gy�ۓ42���[��/	��$��uj}z7-�pTe;e�JB���,��~��J��'��.-��L���h�h~c�E�b���6f0�}��J���t�����s������tIWL{�(�3�Y�hW݅s�結�$t]�4��Eqc�}��� [\��      <   l   x��A
1D�u�u�<�ȀK���&JM"$i��(��8������3����Yp6M��H.�7����*Tu�-����2ח~h��99�N�1��݈E��pۅ~�W(�     