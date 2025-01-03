PGDMP  	                     }            iSKed    17.2    17.2 G    E           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            F           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            G           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            H           1262    82072    iSKed    DATABASE     �   CREATE DATABASE "iSKed" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';
    DROP DATABASE "iSKed";
                     postgres    false                        3079    82073    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                        false            I           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                             false    2                        3079    82110 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            J           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    3                       1255    82121    update_inventory_status()    FUNCTION     �  CREATE FUNCTION public.update_inventory_status() RETURNS trigger
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
       public               postgres    false            �            1259    82122    contact    TABLE     �   CREATE TABLE public.contact (
    id integer NOT NULL,
    contact_number character varying(15) NOT NULL,
    location character varying(255) NOT NULL,
    gmail character varying(255) NOT NULL
);
    DROP TABLE public.contact;
       public         heap r       postgres    false            �            1259    82127    contact_id_seq    SEQUENCE     �   CREATE SEQUENCE public.contact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.contact_id_seq;
       public               postgres    false    219            K           0    0    contact_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.contact_id_seq OWNED BY public.contact.id;
          public               postgres    false    220            �            1259    82128 	   equipment    TABLE     �  CREATE TABLE public.equipment (
    id integer NOT NULL,
    user_id integer NOT NULL,
    reservation_id character varying(50) NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    reserved_equipment jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'pending'::character varying
);
    DROP TABLE public.equipment;
       public         heap r       postgres    false            �            1259    82136    equipment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.equipment_id_seq;
       public               postgres    false    221            L           0    0    equipment_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;
          public               postgres    false    222            �            1259    82239    home    TABLE     m  CREATE TABLE public.home (
    id integer NOT NULL,
    event_name character varying(255) NOT NULL,
    event_description text,
    amenities text,
    event_image_base64 text,
    event_image_format character varying(10),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.home;
       public         heap r       postgres    false            �            1259    82238    home_id_seq    SEQUENCE     �   CREATE SEQUENCE public.home_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.home_id_seq;
       public               postgres    false    236            M           0    0    home_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.home_id_seq OWNED BY public.home.id;
          public               postgres    false    235            �            1259    82143 	   inventory    TABLE     �   CREATE TABLE public.inventory (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    quantity integer NOT NULL,
    specification character varying(255),
    status character varying(50),
    image character varying(255)
);
    DROP TABLE public.inventory;
       public         heap r       postgres    false            �            1259    82148    inventory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.inventory_id_seq;
       public               postgres    false    223            N           0    0    inventory_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;
          public               postgres    false    224            �            1259    82215    programs    TABLE     %  CREATE TABLE public.programs (
    id integer NOT NULL,
    program_name character varying(255) NOT NULL,
    description text,
    image_base64 text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.programs;
       public         heap r       postgres    false            �            1259    82214    programs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.programs_id_seq;
       public               postgres    false    234            O           0    0    programs_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;
          public               postgres    false    233            �            1259    82155 	   schedules    TABLE     �  CREATE TABLE public.schedules (
    id integer NOT NULL,
    user_id character varying(8) NOT NULL,
    reservation_type character varying(50) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    time_slot character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'Pending'::character varying
);
    DROP TABLE public.schedules;
       public         heap r       postgres    false            �            1259    82160    schedules_id_seq    SEQUENCE     �   CREATE SEQUENCE public.schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.schedules_id_seq;
       public               postgres    false    225            P           0    0    schedules_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.schedules_id_seq OWNED BY public.schedules.id;
          public               postgres    false    226            �            1259    82161 	   skcouncil    TABLE     �   CREATE TABLE public.skcouncil (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    age integer NOT NULL,
    "position" character varying(50) NOT NULL,
    description text,
    image text
);
    DROP TABLE public.skcouncil;
       public         heap r       postgres    false            �            1259    82166    skcouncil_id_seq    SEQUENCE     �   CREATE SEQUENCE public.skcouncil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.skcouncil_id_seq;
       public               postgres    false    227            Q           0    0    skcouncil_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.skcouncil_id_seq OWNED BY public.skcouncil.id;
          public               postgres    false    228            �            1259    82167    users    TABLE     �  CREATE TABLE public.users (
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
       public         heap r       postgres    false            �            1259    82174    users_id_seq    SEQUENCE     |   CREATE SEQUENCE public.users_id_seq
    START WITH 1000
    INCREMENT BY 1
    MINVALUE 1000
    MAXVALUE 9999
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false            �            1259    82175    website    TABLE     �   CREATE TABLE public.website (
    id integer NOT NULL,
    description text NOT NULL,
    mandate text NOT NULL,
    objectives text NOT NULL,
    mission text NOT NULL,
    vision text NOT NULL
);
    DROP TABLE public.website;
       public         heap r       postgres    false            �            1259    82180    website_id_seq    SEQUENCE     �   CREATE SEQUENCE public.website_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.website_id_seq;
       public               postgres    false    231            R           0    0    website_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.website_id_seq OWNED BY public.website.id;
          public               postgres    false    232            z           2604    82181 
   contact id    DEFAULT     h   ALTER TABLE ONLY public.contact ALTER COLUMN id SET DEFAULT nextval('public.contact_id_seq'::regclass);
 9   ALTER TABLE public.contact ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219            {           2604    82182    equipment id    DEFAULT     l   ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);
 ;   ALTER TABLE public.equipment ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221            �           2604    82242    home id    DEFAULT     b   ALTER TABLE ONLY public.home ALTER COLUMN id SET DEFAULT nextval('public.home_id_seq'::regclass);
 6   ALTER TABLE public.home ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    236    235    236                       2604    82184    inventory id    DEFAULT     l   ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);
 ;   ALTER TABLE public.inventory ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223            �           2604    82218    programs id    DEFAULT     j   ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);
 :   ALTER TABLE public.programs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    233    234    234            �           2604    82186    schedules id    DEFAULT     l   ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);
 ;   ALTER TABLE public.schedules ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225            �           2604    82187    skcouncil id    DEFAULT     l   ALTER TABLE ONLY public.skcouncil ALTER COLUMN id SET DEFAULT nextval('public.skcouncil_id_seq'::regclass);
 ;   ALTER TABLE public.skcouncil ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227            �           2604    82188 
   website id    DEFAULT     h   ALTER TABLE ONLY public.website ALTER COLUMN id SET DEFAULT nextval('public.website_id_seq'::regclass);
 9   ALTER TABLE public.website ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    232    231            1          0    82122    contact 
   TABLE DATA           F   COPY public.contact (id, contact_number, location, gmail) FROM stdin;
    public               postgres    false    219   �W       3          0    82128 	   equipment 
   TABLE DATA           �   COPY public.equipment (id, user_id, reservation_id, start_date, end_date, reserved_equipment, created_at, updated_at, status) FROM stdin;
    public               postgres    false    221   X       B          0    82239    home 
   TABLE DATA           �   COPY public.home (id, event_name, event_description, amenities, event_image_base64, event_image_format, created_at, updated_at) FROM stdin;
    public               postgres    false    236   9Y       5          0    82143 	   inventory 
   TABLE DATA           U   COPY public.inventory (id, name, quantity, specification, status, image) FROM stdin;
    public               postgres    false    223   �|       @          0    82215    programs 
   TABLE DATA           g   COPY public.programs (id, program_name, description, image_base64, created_at, updated_at) FROM stdin;
    public               postgres    false    234   (}       7          0    82155 	   schedules 
   TABLE DATA           w   COPY public.schedules (id, user_id, reservation_type, start_date, end_date, time_slot, created_at, status) FROM stdin;
    public               postgres    false    225   ��       9          0    82161 	   skcouncil 
   TABLE DATA           R   COPY public.skcouncil (id, name, age, "position", description, image) FROM stdin;
    public               postgres    false    227   �       ;          0    82167    users 
   TABLE DATA           3  COPY public.users (id, username, password, firstname, lastname, region, province, city, barangay, zone, sex, age, birthday, email_address, contact_number, civil_status, youth_age_group, work_status, educational_background, registered_sk_voter, registered_national_voter, created_at, updated_at) FROM stdin;
    public               postgres    false    229   ǡ       =          0    82175    website 
   TABLE DATA           X   COPY public.website (id, description, mandate, objectives, mission, vision) FROM stdin;
    public               postgres    false    231   e�       S           0    0    contact_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.contact_id_seq', 1, true);
          public               postgres    false    220            T           0    0    equipment_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.equipment_id_seq', 31, true);
          public               postgres    false    222            U           0    0    home_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.home_id_seq', 22, true);
          public               postgres    false    235            V           0    0    inventory_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.inventory_id_seq', 32, true);
          public               postgres    false    224            W           0    0    programs_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.programs_id_seq', 1, true);
          public               postgres    false    233            X           0    0    schedules_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.schedules_id_seq', 73, true);
          public               postgres    false    226            Y           0    0    skcouncil_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.skcouncil_id_seq', 3, true);
          public               postgres    false    228            Z           0    0    users_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_id_seq', 1000, false);
          public               postgres    false    230            [           0    0    website_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.website_id_seq', 1, true);
          public               postgres    false    232            �           2606    82192    contact contact_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.contact DROP CONSTRAINT contact_pkey;
       public                 postgres    false    219            �           2606    82194    equipment equipment_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.equipment DROP CONSTRAINT equipment_pkey;
       public                 postgres    false    221            �           2606    82248    home home_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.home
    ADD CONSTRAINT home_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.home DROP CONSTRAINT home_pkey;
       public                 postgres    false    236            �           2606    82198    inventory inventory_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.inventory DROP CONSTRAINT inventory_pkey;
       public                 postgres    false    223            �           2606    82224    programs programs_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.programs DROP CONSTRAINT programs_pkey;
       public                 postgres    false    234            �           2606    82202    schedules schedules_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.schedules DROP CONSTRAINT schedules_pkey;
       public                 postgres    false    225            �           2606    82204    skcouncil skcouncil_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.skcouncil
    ADD CONSTRAINT skcouncil_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.skcouncil DROP CONSTRAINT skcouncil_pkey;
       public                 postgres    false    227            �           2606    82206    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    229            �           2606    82208    website website_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.website DROP CONSTRAINT website_pkey;
       public                 postgres    false    231            �           2606    82209    schedules schedule_user_id_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedule_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 I   ALTER TABLE ONLY public.schedules DROP CONSTRAINT schedule_user_id_fkey;
       public               postgres    false    4760    225    229            1   G   x�3�442�515�5��4 q|3��Kt���Ĥ����L�̒J�Ԋ�܂�T��������\�=... \�1      3   $  x����J�0�u��k[�%''�N�<�[uQ�]8��Q�ݍ��L/�,����q8$�����꺲j�}F@�B��h@<)�)�}/���YQ���U��M��˘<�4�]�{����?��� ā\����Ru��l�^WmNvhk	�\f�*�Xij��>�	.UɪC�c�gg��f�tdm�GR�Hh�
̺T�C�Zq_O����oү�'3)��T�V
�AL-
��T%+�6��I.�������W;Z������m%���l+���<��,5x�p����f����<���H      B      x��zז�ȕ������� 	��/�����'�Y�V�$UKޛ�+��0;��g�`�_��/���)�̖0�q�U���.�q�?L�b�y�9�vNy��������u�jz����Z��yl��I���.�N���o�S�+C�M�	O��������~ܻ�]m
�a�q/��q����'����8�UV�!��}�Q�MV���n#����Ǚ<w3��*p֝�r0��z�������|p��/xn3��;��F�����\���~�6G�
��;��0/�=:����!\��z�#ʾ���d\������1�_7���"��CT��kBE�)�Ur���vE�s�<��
��o��&��	����߽[Nr�+v-{^MA3(e�xMO�0*���.�ez�ӿ�L)��FU�C�2��  �&����qgVa������`�]��{���4.\���!�_m���b]�K._#�c�Y<��]�*fI�z��ʹ��a���R�k͘_5 �^)L=ߤV�W�	$�Z+j�n��<�/���Xއ��$~��RM�;횿B��7J�kN�~#7a7hU���4�4j����h�mү{IǳU�Yw�$�1��E��4j)�~��q�>r7��8}0�(�7ׁ�����l6.g�GU͛�Ջ$�S1&�ܜy'O�ӏ�Ia�}����x�+�X���7^��4Qd�!���A�2�rPt�[f8eX|Z�ah���qKe��PJ�A����ꜘ��
�Sh{�1��Ǻ�~�S�`zN�x�6��V �J+�M�4��Q����}�;-@�K)Wlέ�fͲ������eFF�Z����t�GӺ���:n7L(������
s��X�2zуEY��e�AD�kj?��ے)�)6q�p��ex�:ɂ�t��[�Hv�.�֒�Ⱨ��t����V�������W��	._�q���,����j �P�.���[?�NOK�ZH���'�wz�Uw��=q�IVk �l-���KD��H�:�@�~����_Ͳ�^!H��=�^���v5>���C�m�z/r��pw^ɖ�&���$�� X���z�ҷ9c���lfͤ'p��UZ�md���ߠ�.�B[g=���=&��%7C�K��~M��T�y����÷��A��s������
������M�`�?�M�H��%&����jZ܈������E��L���>�)-�EqZhT�o�T�����X���{3�с��4��W&9�i�/�+��i��<�S ?�������Z��S��O��bv!SEN�ܷ3khz���_�D����cў��?�& 
�>u��s��;- ��v�˷��V��5'%�k��1>&oD���3��J��@�:�������#c|�7*<`�'ӓ]�~�Q�9P�2=�ł�z�.;��t�I��@�^��o�Ļ;�Qp�����ֆz̞��(T�Hu9�v��5F8�"Ƣ微O�S�|g�ƭ�^>��6��������I
|�~fM�ጆ�&$Ƶ�aˌN����)�E��6��YN�ㅵ'��^��`uIO���q�5y�#��/��7���	PVJG�'� T�ϐL�irӍL�|Ht��RrY"ݱsF>����q�`Na_v�����d+:n�C9��u-5{	��:ñI0�H7k�I�J��P��gLޱ*V�锺��)rZAbf�Q�b�PB>&��I��k�:�Fe�{���f�ځ#�� ���%����zu�B0�Y�N1���z]c����!!�2�A�}(��b�^���,ʼ�K��$H��&�9ˁ>����6�<3�|
xWcS�j�s��\9���i"�uS���`�Ak��.9l� EV�1wo)�bm�˵����eo:�*��,id�ୖ�4��cb�-��5�J�o]�t�*G��G��5%��ή/xAKW|�|5�[;����!�w��ԺQ^a��� ���ƃ&@�e��<�r��V�ٓ�cB�����薬,��߱��i۞N��K�/�NYC����Ņ��w�v5U�S�[�7�PtfGrğ����!�;P@�wr
|��<�»��iÓf�R�����@o���q>�\1Qv�F#���eǲbQR늶o�Ә���7��u!C�Y`Y����~��}��~$�}�2Ì��W����ӍG�Eߡp�nR�W���� �K���F
��bz�eDF�0w�r7�E�FUD���V�B�7�N5�~��LI;Y�9y��y��7*��R�N�#|�q�M��%﬍#>i(�^��\<�n�<rd	v$��0H�L�ou߁�bq�/؄? ������6bⷦ�
��;
�xog�N�=j5��9e<z}����B�e ���"8R��J�j+S��BA�?�@Z[��̛H��:)�@*�/�]^���r�~�9r���C�,�w]G��r�U�K���b���y`�{�+^�6� �ղ_�͞�U��e��.�?�v���
o�M:����l0k3o�ra��7Fn� ����#V8���\���[2\Q~���-����P��v��o��id�d^���t#��E�~���u^B�Hg<:�<|�Pae�����U�߉ݸ�/�e*"�,}JG��B�X�ĩXD'��s�=S˛y�_�ko�v�jNQ1h
螨���-�'��AL��ljHM���Pn��"<}򚜪|G��� +,X˾��0�2Pz� �Bmx������35��u~���p�� uR������>W�|��7r���l%Fkj'���aܳ�
 ��W�U�Bٸd���^66�@��-u��b$RX9�z�[��Zဘ��i�G��*(��e�ƵoQ	�Lϯ�!�S�f�U���e����w�Q-զ'9W��ru3�(���]����^��te��������96�r��#�{g�De�y�R&#�,#�]%(�OӤ]�&8���!�<�%v��ޕ�ƭ�w\�r!C�gNF����g�����;�\��2����B�c��%�K�(�.�--��]� �)!lH�V�ۦ�=�Vr�4S�/^�$��p��!�k@��W���ܛ�Άpr��)9��<z��] K�9���޸�`߷f�W�S1h'c䑈�ݼ�W��\V�Y+̇����%'J�5�w��?]����7����F�!�a�.����X��`���Hp��������"��o('Fl�dƺgחm�6��ͅ�%�.1�Ʈ����if׋�-������D؏��A�`}�Mi�Ǽá:�A5��4+�Pc��U��)��/���A�d�Y %�2�����൶�a�wuz-dr����d��9�0�^}w)f�ɇ/`�j5�G�g,�,�e��IR���~��]�͉�F+�`�%f�
��+������)�~6�x���D>}F�r��ms_?~�+>���R��ꁞ��ˁ<�Q��D,��}--����`�FQ�Q�b=��\�ˣаw�Ӭ �.6F�M�̗느LWb�㰡"*%��Y�L<�6	b�I�����+���H�9��v.̽KFAf���J�Ք(�.?���ޱ���P�Cv���\�i0����,U|<w��Q���Bi�Ɲ�	�$�^�܈A����?��š#������ �������)+���5L.��縓	X�׻7!1������;��o���swe���S!��2A�u�ъ�A�[7b�Kut٤�	ƴѩNE�<9x
�(7}�s�e��4�6�⑳\F�l	]TN)�/��$L����u;y`����f��;�ڻ��ߓ)]�ۚ��Z��<��7�Q��$�2��<�.��U�7�\�s�0����0.+� �f�XK�C��|�UE�-ޫ��jG���A��t�����m\<��&��D%�>a�=W��s�I����A���'L0��Ŗ���z�f�0_����$	�lƌ��ٓ���!nR[���R�b��;�e�_XU����_�Ų�^���8N� ��#�g4�r3�W���x��NV�7mG�i��{4,���q��63@�e�O�&Phh�;N5�4��ېg����    �û�E�a7#}upa0O}����t���pس���Z+k����c*���6�}���R��'�-.�N����N��/FOo��h��������JU�!\��D�����s�O�WLdG}�(z*)��Y��躑��k�	���~�Õ͊0����oΞ�w5'_a�w��0+��e�~��cf��-��<>��7�h�Qz��Uj����LV61���ΐ�:�T�!m��B����(-�~aA���9�s��o��r�j?.#D� -L��\ED�����&r�r�]�'����%f��C��d-5��%Z��w��� �1�ЇX�9��jʜ�g#���Lv�ɴ�z�wƂin�$�p= $��2ݯ�I!9�Ah�2�q���J[b4�+�u&�i#��`cp����A�w��~t *f>���R�|r/�IN�����ص��({�5�57z�hļi��&�����҇�#;b���9���z�q��5(S�e�N��jт}�y��ݚ�.9���@�0��;8	��4���=\N������u�CJ��yx���EdL��H�$#QWw����J�{���x"��V�Ĥ��rG��鄫�`Ӽk�u��;-u"wؐ1�z��
"�ޢ{Hԏ�>g	��<'���Q�H��0���pbz��n� d+��ԥ4	�>��Cb�~�e<�%�LAO��+$�@Y}ix2a��j�A�}������F/]tC�e��-�9�D��v�/��i���ԥDE�°�i	��l��5��!�m%XLGa��9Ѡ�z�
�E��ab�a�7�3F'�ho%�	V��}e��)�	�mwA���E�#f��K7r_5�Ma �R����ˉLC���������&#��+���'��7�6�Y�М&�7�T$.�S� ��<�:*� �\���/�~^/@p��˔��Y�u ^~�4b�� �+�-<8^+�x!�C\����8XU��?+%�)E��JVGl3��GC9�C?��X�1;�C'ZN ��\�p=��pDY>0�_�W�~���,��"�gu�,�� /��L�<*R���.��8`�;�m���BpT���.�.���7�^(���)tP{�O�^h���S�([=a�P�n$}��j�t������+ό�N��Z{�b���G�e�嵀K�( �%�2rB"
h�[D�b~��و^����G�n���7mw=!���=��v�A8��b�m�XQ?�I��/U~S�����.�4��y��3}����䠠��
�385~��j\�����O{�9�1��ɸ�/�^�K�})�or�Ψn�|���m�?i]Bu��~�KHc�N����C?��{������=GA�q�x�t�Ө�9wfІ�!I��L�m�c���-_�h �g���{���͜��?w���a�d�+U{�u:Pr�cPt&D�'x$�)ט�P�E_�t�i8�c]ꑫ��m��Z���~ٗ;�Ju���\s��e��U�7���SgF��@F¤"-=����J����I`��v~](b�x�(v��;,�L
���c�d�LD��V���L�qg]�}���>��o�]�}�8�Ztk�-��35���35!!�r�!�D�mq��u7�����e_*o�E����ZG��E�wV�:"F����o���;N��v�� ��Vs�P� A��9�do�W����O��j�M3�n`��K�⣲v������3��(�q�v��Z%W�ޡ��[M����������S���H�ߚ=�{u�Y�7Ԁ�<GP�R�(C@�q��?�5��%g�b���g��U��_���x���dLCb�M�^����0W#X�7��I��i��Hʁ_m�!�by�&{�$����(�M�W�E�GPM�w��%�j������rq�v���ˑ��ҭ�)�YpJ��d\r���D�hm=:��-Y>�{�����K��?൅��*�>E��7R�r���㰔�����]@ �x�CI+�zn�x^�ؾ&O���K� �}����y�㳨����T%q����J�v���r���H`�Gd��'��*�˴¦�Տ��G�:� �!�R#j�;�8�@1���d����+��_������^��=�r��~���Y2��M1j�w�j��1�xZ���	�ǟ�cW}cg�۷q�U{R^^�/6)�ϼ�sg��1����(�y�"�-�x�{;��S`�_M��ΏԎ��>�*�p�\u~#":%c7-�~.�Q��C��X`�
��4s�+,�N�U�8�-Ѐ*��Ɩ�Kt�|LJ��B�-`�f���ℿ���L��ϼ�GP�mM�aN�	T�@Y�e���B�w�8jB���l�ƶ�]�
�ކTm�緇�G ������̿��p��$ Z���^��p>gO�g)0�%Ab�nU����>I�X&�0�^-�e�/?�<~F�_� !�ߤHΥ�g?)�}Dϐ:3C�x�X�S]��Ӥذ>�[x�� e�k��0%ґ{^U��
�¹�"I#�>���W��L�"�Q�'0�`Ó�v�4W$����[���!8�0��>�D�aT��a� �s�UCdR��r6{:J�0ט"�O�`9(��v%:��Ԇ��s�V��u$iH8�����]�p������qk�C�
��)T�Ñ�`-_�����C=�9|{K�Tk4��B|�����U+��
"��7sf��n�D�<���'ȷ���*k}��~?���b�o��
�����sNu�1T����\�@jf�i_F��¿��bV	3+��s��~�1��y�~��]l{CG`�0	����>�9���o������U��B�0y��v���QP4�����9,H��O�ϧ�q��g&w0�����d'|/(F7�9��~;�Ղ�?)�ղ�˰�ϲ�������_�@�C��
0,�U�9�؄O�@�
�6�&�dH��
[�Ix�o�.u���L\��v�G��S��4h%a䀄`\���D���F|�^d��1Y��������d�^hU�=�،�X��j�k~"�T�����7e���ɐ�a�tY�e�(�/� 6!�`��E����7ur�/h�x���N���c�f���D��!��z�7�=ܤlpʍD����s��{lV�X5�2l�� k1\%�|�9��!�K�6��f^�j&&-���E���o.��@��I7O�GW���p��0����#Q� ��ؚpwi;���X����F�P�>�V+��I<�֕���{��X$,UARҾKJ�=���*��a=\ʞ�}�����)B� *�D�f�9]B�W/�s�qMٔ� �"R��['����KL?�#ǳ�i��յ�@���t�Xpp����l�LUv"��|@�
B%���~!���Ur�+r��4�]嵣K�ެ�Xz��\a;�ySpFr�w�C�m��!����ތ����@cH�2���l�|�+��sg	k�M;������#��W���g���d����q ��'��}���|�?�}��#X��� 0��:~qO��6�M?A}�#0H�L��ܐA��~7��k�V.��q�;a�eu�������枟� �b�)]$� ��2���{0������W�pæi�����C=;L�{�c���X�N_�TN��iIdC	��C"t�G��[#��Bc��Q��{���]7��[��u�ɝ�LY��v%�ѓd�ba0$��e�e���9o���\�3�	�~�M�i 鳅3yş\\b��E�����^��ZMsH�-�a?"�t����K�gRz�����]V/�;��k���ͳ@��v�x9UE��J���RV.%Y�o,"�@�\�H��N��,�^���<xg�U�]����fOu�yw��s6�'��SI[�_��Y��L�pq�Ku�1Ǡ-&�f� ��1�3�t͏�޷�5a!���P{^B{$��<�J���}�׏��yU�n���F*��	�I ?  �zG��]�X�þa�5*#��g+C�BC���B1|�rj|#Z|6%�5h����߾�eu[��x��|$P�2e,� lt.��K�=���p�����x�	x�Q���"!8��L���ٯ�����e�9���xC���:|-Q�}�zz6�*�)<�̞����I�M�e�+m�D5� ]���c|.(6�GK�1�ހ�$��%�[7Y;�\�G�.�!Ib*�X$�UC�g?�V�����[���K��O��Ȱ�cX�X��%�h��J7"����u�8m��륾����@&�A�!I$�����wv$ȉN�s(�����3���4����V���L���:0��m�(��F�P[�~�����2C�#�d稁=V����Z��}����×������
�'�ak1�[U�כ����[عs�sG�Խ��nc�yb�g����]����vگ�Kҟ3��a���W xPh5C��g�y헗'Ϭ�$ܦ�85)��%D�Ly�lT�{ ���a&�vG#�"�ҙ0�+�����Q��Y���e��M:'��\s�W���o�{�]4A�q1e:J����������e����އ i�P��6�� ���������ʊ�H���3%`����]7���e΂R�q��ă�R9F�M������o�<J9�X�us�%4�s�m�Ӆ$�VN��y	�N��ȭ��=3z<�'�<A�"�]?��E�J���"L�'�i<��{�d:'Y��n��;�- =�a㺮!r����q�mGw�b-��e��^���#&'�p��Q��!�_�_�P��	���J��?������׿�?�W)      5   �   x�M��
!@���+��O]F�n�*�j�,�q��"��rHB���}J��6��lj>\�]��Xn�X[e��R��%'�C2h��WJ��D��Fe���80BX�C|L�?�1�}�����/e`;�{d�*�      @      x��zǖ�H���+f��V=+ $�"�l 	��׏3"�ˬ����ǝ�ͮ]s��|�$��wф�.����pJ)��l	gXU �o��W��#���-������l�����>��_�������埞Ƕ��q�t�*���d����=��2��Є�����/�z��ǽ{�զ����Y�ZN�q�pry�Y�Ye�ݷ1��U��a���6��k?8�q��s7��g�9.د�18	|�������6C���;ot�O�������WnsD� �Yθ\�b��s�]Q1��.
ʥ
��;���ZH�UOL>��J��u3�Z.�N�:D�_�&T����Y%w��mWt=��Q����V1n�I��?�ݻ�D!�bײ��d4�R����T��r���\���?��Δ�1?lT�=�-l�
�kr�:*wf�6�pHo�o| &��g|���7�~��A#�����2��v�^/�u����1�<6�ų��ūbv�t��鬜�j&��*U�֌��Q�����Mj�z5�@���⠦����s�2��M��}تH�x*�ԻӮ�+��{�T���A�7rv�V�a�J3L���Q�/���&��Ǒt<[�uM"SېX�L�����7��'pO�#w���7�xs�p
�p�o�f�r��qTռ9]�HR8�cb�͙w�:�(�&�7�N~�W��8���X�)x���ME&�B�Nj!s*� @׸e�S�ŧ��/��?�TV��D��q�Y��ΉY���:��'�H|���w:�
���Gk�xk©D���4Ml���yJ�Ǽ�4��r���*o�,�j��i_fdT�u,��j@JW�z4�K���vÄ�Z�	�Ay�0wj0�e.�=X�58��\FqD4����(!�-�қb7��P[����,hL���ŏd'��2k-�.{
�Iw�Ln�hooީ��ڐ|e�j���|���������k�H���������T[	�qB{�w�PQug��d�����⯉�D䊏����7�����,��D}у�e�?a7`P�X��0�ߖ��"G��w�l�l"�?Or�z���|�w)}�3VI��f�Lzw�^�Ea��FV��.�
�,�u�ùo�c"KQr#1d�8����N��W���>|{Ia�?7ͿY�(!=����:�j{��_	���3�T���]b�A>1iP���ō�p~�|^��ʹ�ɢX���F���Ju�Aq��j~��	[�G0��8_N�X|e���&�R����f��C>�����M��5`I;�Y�T��-f�1U�P��}�'1����Ll���HDiHQy9����#i�@��QG?'�����i�~��|{h�a��/hQsR���ֻ��c�F���>#������=>�,��n�:2��x��s�~2=����'u��*��],X�7���Ag�D�t����tN��C+�q-o=�lm���	یBe�T�SoG�_c��/b,Z����;�(��wVzPaܪ��>i���N��L������g���h8kBb\{+���d���RZ���ns���48^X{"-��(
V���?��Z��<����}���� Ea�q�~Be;����&7��Tȇ�@��(%�� �;g䣟+x���ewɫ�x��A����>��n]�R���l��3�s�t�v�T�Ta������q���b��N��n1�"�$f&�A-&
� �c����ʱ6��j�Pv=��8�nf�hp0R����]��؍�Wg($	s���so����0�M~0m.�݇2)���u�hȢ̫��H��:lb�C��ü?Hks�3�Qɧ�w�16խ�8�J[����k�� �^�1��
�����Rds��r/���\���iQ���29��ϒFv�j�M3>?&v��[�P��t�֕Jg�rdM|t�^S�������tŗ�W�3	���{�_M���9	R�=�i<h$[f(ɓ)Wzj��=�[1&d_��
�n�ʲ���꘶��D:�T���5���[\Ț�kWS�;ս�|s	Egv$G�i��y�"�}'��gk����(����0<9a�)E�����	$�*}�c����ewo4B��Zv,+%��h��1��-�}��[2�pN��U! /�	�x�G�7+3̨��p%z8�?�xD^�
���!���W5��9ZB�4�XHo��/)��ZFd�s�,�p�Y�jTE���h1-D|��T3��'ϔ��������x�2>�/U�?�w���~�Z���8r����Z�ţ��!�c G�`G��d�4�V��.���M��l�!�\���i#&~k�	�p�����v��$�ӡV�ۙSƣק���*�~[���*�#�`_�!���2��/��s
�����̼�䝮����Z�ұ����,G�g�#�^�8D̂y�uԻ� WX���9m-&h���`�G��%`#� ^-�U��]�:]v�>�r�s1hס+ʨ�&ѤC �P~�a/��p�6C�(&l�a�F�
)�0b��{��L ��%��w�ݒ���o�)�깟F�K�J}L'1B�]T_�'�yX�%4��tƣ���VV���o�n_���؍�r\�"�@a�ҧt��A+4�5�M���@t9;�@��3���������mw���������R~"k�t�ͦ������x+���'�ɩ��p4�a��������k�S(��2+ԆG��`y�>�Qc�[��l��7:R'e)a)���1�sΧ�{#7�o�Vb��vb�����=[� bi~UX)��K&]/�ec��L�R�j,F"��3�w�X�U��P�5�IOA��z$	��b��Q�j\���;a����R;5h6\U9�XJO�8|��Rmz�se�~ W7���IL���1P꠪��E�I'Qư��P����/(�c*;@;�wKTv�W(e2ɢ1��U���4M�e��`Ҁ�~��B��^b��o�]Ij�zy7�5.2�q�d���:�~}��a�#���_)c/Z�/�<&Q�Y��t���B�ҢJ�5��m��mٓl%J3e���H���Q��!��^x��Ƚ��l'�|0���{ͣ�@����SyM��}k�|�;��q2F���e,��eP`u���|�@��Zr��]}����5�(��~S��kN��a��K�ߏ�|���ы'Z��Ш�QXxk�.��0��rb��Mf�{v}�6k�[�\�^��co�K�.(�fv�������~�K��8�� �L ��۔�z�;�cdPS��N�5� �Y�@������y�TJ��R��*ܽ��^k� v�qW��B&g��N��C�	sK��w�b��|���.�V�x�|��Ͳ[�>�$u�q��)���ڜl���]b��P��B:/�����g��hM��g�/��6������3:�/�ت�ɨ��s�5�L��=@����{\F�a�k�,��-�%a�<
{�ދ0�
�bc��t�|���t%�>*�RBߙ��ēn� F���H���۱үˋ$ޛ�mm��ܻdDaFH��4�XM��������K��u:d�ߛ�5��X��R��s��e�>�*��i�	��J��΍Dȸ�Ӻ�P:2>��خBj]p^�OȻ����*�Z���x�;��5x�Kq�x����������=qW&}8�.$XW(�84�u#V@�TG�M*�`L��T�̓�G�p�r�<wY�M�o�)9�etϖ�E�$�"�;N�DQX�
Y��f�:�n��zP�ï�kI\`�=y�ҵ���.���.�#��q#e;O�-C�ʳ�b>�PU}�ȕ:G��~�b` j����:4?)�g\U�i��Ὢɮ�v����HO7H*M���V�u��l�HTr���s���>Ǟ�o_��}��s�Xl	(̡Gk����I�I�p�f̘ߚ=�;+�b�&尵��(5�)&��sX���U�K)J��^,�� ؋��m=�qq�A��!7�q}�l�w��dU|�v���V��G�����h3�.Y�j��v�    �TsI@�[�y&��0jx�9�AX�v3�W������Og���q� �={)����&p��8;�bj��'i^�.u@�}�������X����b��F���?K�j�ɹ�T%Q¥�L���87�x�Dv��W�����ܝU艮��֟л���:\٬S�����9Ws�6�|����h\��ܑ:f֚�ѢK����p���ʮZ�vڊ/�deӻ�����J%1��61_.�X+^��������p?ѹN��i,'���2B$�����U�@�\/���`"7,7���RI�xa�.\bf�>��I�R#:\���xwϰP�}��w�3����i6��1�dןL۩wxg,�&��I��@�_,��������.��>��J��%F#��-`Pw`b�6��6���|4|�J�G�b�3n.,ȇ!���h`�H�]����gzaQ�Zs��F̛v�n���<��.}�>�#&=��Y�w��^�2�]���4L�-��0�'��ЭY��C:	$cI�c���=LS�I]���������[7^1�������nQD�+��N2uuן�ί��Gq�{��'�.aE,@L*J(wd��N��K6ͻ�Y7Y��R'r�#Y��� �1�-��D���s�@�� �s��OōT�� �{K= '�W	��
B���H]zA���S(�0$��W^��[����>��B��՗�g!f\ ��K1�W�z�p1 �n��E7�^��|����қsI4�n��B_����)�oA]JT�(�ؐ����zq_�!)r�V��t��7���W�PX��&�q�x>ctb�|��V"�`ui�W&_�����vtʭ\*1bf��t#�U� ���!e��[���4t����>�+�i22����{��x�_aS�%.	�iby�IE�8E0���.	�υ���r�����W��ʱLI���_G��L#F�
 ϻ.Z�����=�u�_�C��Q�z��R��R�no�Tau�6�Y{4�S<�cȈ�s<t��"�ɥw��Ú	G�����zu�W?��"-�zV'�"+��r�Ȕʣ"5��貹+��������(G��1q����Q��_��~3�2�ۜB�ǡ������;E��e����F�G(�FN'J��,<�����Э��-��Q�~��\6
Q^�Ġ� ^�/#'$b��V�E�/�7L���K�m}d���jzC�vW����zN�S�o���;,�ƍ�����Y����R�7[/K��1L�X�W?ӷ���K
�9��=��.HQ���ƥ���@�����#�xa������%��ٗB�&'�ꆺ�� ����V����%T�Y�'��4��q���9����w�0�8ː��sDg�GJ�=��sgm�����$�F>�����~�@��=����)��s�߫�KF�R�g[7�%�>Eg`B�|�G2�r���e]�UKמ�s?�Х��������xz�}���T���5���]�@�Wu@y�=�8ufԙd$L*������(��T��_1O�ֻ��`�ׅ"��bǱ���b̤���?�J��D�o�Z,̄�w��eߧ����An���5���c�E�f߂,?S��<Sb�/70��Ad@��zXw;^I��[���A��F�yQ�.�yȮut��@�Q$zgu�#bTL�:�f�����I�l�j�k5�����8A���{��:�w�����4��vl���|!>*kX{(N<C�m�B7k�i�Ur���˽�4H���X���>eo��$���C�WǞ{Cx�sEP-U�:�2���
�s^c�^r�/����x��P��L�-nЋ��PO�4$������>!!]�@s5��x��$Q(�������.��h�WI"I�����T{%]T~��z']���p����+G�`�*��(!��W����t<�I�%�o�N��֣��؂��峸W~� *�K�^[(1Q�2�S�%�*GL=K� /�n�
����=���r��&��ŉ�k��|���
��7\�.�;>��>����JU�
�>��oG�x+�z;��}D�O�q2�r�L+lZ�Y��]���	B)5�V�c�3
/_LVa �-� ����)������cq,���ڙ%Cqz���{W���S���1y!� ��p��:v�7�qv�}'^�'��e�b����?w�͜>y�!��w,���'��3�=F�N��)��H�H����r��U��1"�S"0vӢ���E�>���&�`_L3���n�4�HXe�s����H`l�p�D��1��$x+�F^hf� �,N��[>��d`���[|%l���攟@e�\�;�.D׉�� ���ζjl�ݕ���mH�v1�p~{���q`�Oʬ�a���kog!�ZL�e�{��=����s���|�szP$�V%�9�Ԋe�	�8�ՂYV���3���a�e	��M��\:����G��33d�w�E�:յz?M�{�C��g��Pf���S"��U5����-���)�4��s�\~U|�D�*B�zR s6<imMsE��zo��k��@�(�O��F���6�<?Z5D&U{,g����Ts�)"���"~mW���Z@mx�?'k�H]G������a>��
�ٿ�{��>d��ٟB:��U�	>�>�Û÷���L�FC-ħ�[��ZU�k� ��~3g�_�FN�ï��}�|+?�ʯ��������C��-F��P � ���8��P�Ce�Z �ϵ�f&�F�e4�)��h= f�0�b+0*1�L��#��7p�'������7t��`}�Q����}�����������^�8/D�7lǺ��5@C� �ɟZ�Â����|J�J��yfrs_8�	�X�@v"���2at��Ӹ �Q-h����P-˻�,{( {8I���?��ѭ �B_���M�T~P4� h�o�N��L��u��w 1��Rg~h����Xi�yd�=��N�VF@Hƅp��K�)HlT��1�EK�5���M����iL�)��V�*����n�5��6��'Ba J
��P�}S����I6K�U]� ���`2���Y���y�m}S'���֏�?���>�ma&-�~J�P!��@���p���M���Hĉ�<w�����aUX��Q�*�v���Ub�h�����M��njc�n�5�fb�ra�=]t�����	d˜t�dxteX�H��K	C�o�?�y� �O��	w��V��Kj���9\�m�e�m��\��sk]�^�����E��R$%�����C�!ګ���å�	�w���[��L�"( ��I�jv��%��q��>�הM��)"%<�u�Y�+q����18r<��V|^];�
�~�L7�g������Weǁ ���Ԭ Tr�� ����P%�|�"7h�M#�U^;�t��Z��w�ȵv�c�7�a$W�y7��;������|A���x鼍�4���!#K����0P�rM�1w��&�D�sY[�]^��0�X�`~��|v��KFq��@����aq�G�_��_���;=��_��si���t�m�����>�4����?��I��w�&(�g����&\VG�|J0�Q;���a��i (V��E�A
 �-󡈞���}��>�p|e�1l����]�>ԳÄ�G=F�z����<A����D6��H=$A�~4ɸ5;*4f`ijuh��)-a�uc��e�_7����4���jWba=I�-F C��X�Y�n|` ��&=ͅN;c� �W�d�`�>[8��aP���%6�^�O�*|�Ȩ�4��ٲ�#�I���ɼ$_{&����.�e��s�иf߼��<��m7���SUD��!����+�(e��R�E,�v�"b
4��d�8���k����i�̃w�[�p��Ś*J �{�T���wW�:g���:�����5�U�9�4
'�TW���s��al��B�=sO����a�}[[��\�W��!�Gr~γ������7�@|��̟W K  ���m���)�@X�$�wDIم��e<�fZ�R0}�2�(4���)�W(��1��g�P_�ƭ߯��k�PV��;��@���w@U.S�r�F�Ͻ��C��� �/}�Ax��G���Gj�/�s)y�h��j��/?]����^��7��p������7��gC�r?��3��,�=���TXf��fHTЅ+O8��bÀ�y�$��H�m\r�u��c�E}�q��"�$V�b�ER�Q�0dy�s�k��ߟ��T�������{�[�0��5�]���t#�k�X����^껩��d���D�;|g'@���?��ފ�[y�9�ϛO�~�Wޛ�G������߫C�:��V�2~
o�����َߙ,3<BKv��ciJʪU��'��{?|�mO�ު�}���ӼU�y�Y;�μ��;�=wDM�;n�6&�'�~X�]���5��?o��Z��!�9�8f��|���V3$}���~y�p��ZN�m
=�!�S��.;_Bt͔��Fպ�@�if�nw�0�,�(�	C���M��ܑUHށ\&�^ۤs�:�5W�q�h�����w��A�S���8���{���x-��X6kA1^��}�F�71�h�	"�YO�9J�ب��8�4���=#P�ѱ���u�{���pP�,(ǍN<�+�c�ބ����o��Fϣ����Z7w\B#>��Vx1]ARj�ۛ� ��$H�ܚ��3��3yB�d�!R����Q_D��Lp�,¤b��sN.��N�s�X��ܽ3�г�6��"�I/���vt�)�"p۱[���-��br��!������P�q���(��X��|����_��_�۾^y      7   �   x�E�1�0���9E.���q��ԍ��l�D����VJ�߶�)S�)J�[}Uu��G�	�ٶ�uV�G$�SQ)��]Z[���0����i�+�gt�J��{���r���b*�fh��jfo��w�&�      9   �   x�%�A
�0EדS�	"ں鮨(Vۅ�Rp3��(&��޾y���J�-��!�!�4,�,TL݊^367L�f�0A{�d���аZ���,���:T��[O~pV��~^/A�2��R9����^��~]q�1����ʠ�v��_m��x4      ;   �  x����N�0���S���⬠�Ш�+�R��T�,�ӓDS	*TX�l�巿��Ĵ�����8���Z5���p�Z��������m9�2^�~���][�K���gp�*1��97������!ɛ
�1��15p��2�[�����U���\1���.�hm1��A?>�t1�UF�h��GF���b
�]��d�/����mm��ز��}�p��V64M>����hQ����C��O������·�������w��i�!�X&E�0R2�ER��0X�f��p:t���t^�ϕN�o�y����oSRRMI���%h�V�gm��>8��,T1�+.cƻh��"d�_2Z�t�䏄_y�]�db�L�E�x��>2���(��u��      =   l   x��A
1D�u�u�<�ȀK���&JM"$i��(��8������3����Yp6M��H.�7����*Tu�-����2ח~h��99�N�1��݈E��pۅ~�W(�     