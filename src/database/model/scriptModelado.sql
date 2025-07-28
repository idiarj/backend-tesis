CREATE SCHEMA IF NOT EXISTS public;

CREATE  TABLE public.animal ( 
	id_animal            serial  NOT NULL  ,
	nombre_animal        varchar  NOT NULL  ,
	especie_animal       varchar  NOT NULL  ,
	raza_animal          varchar  NOT NULL  ,
	CONSTRAINT pk_animal PRIMARY KEY ( id_animal )
 );

CREATE  TABLE public.opcion ( 
	id_opcion            serial  NOT NULL  ,
	des_opcion           varchar  NOT NULL  ,
	CONSTRAINT pk_opcion PRIMARY KEY ( id_opcion )
 );

CREATE  TABLE public.perfil ( 
	id_perfil            serial  NOT NULL  ,
	des_perfil           varchar  NOT NULL  ,
	CONSTRAINT pk_perfil PRIMARY KEY ( id_perfil )
 );

CREATE  TABLE public.perfil_opcion ( 
	id_perfil_opcion     serial  NOT NULL  ,
	id_perfil            serial    ,
	id_opcion            serial    ,
	CONSTRAINT pk_perfil_opcion PRIMARY KEY ( id_perfil_opcion ),
	CONSTRAINT fk_perfil_opcion_perfil FOREIGN KEY ( id_perfil ) REFERENCES public.perfil( id_perfil )   ,
	CONSTRAINT fk_perfil_opcion_opcion FOREIGN KEY ( id_opcion ) REFERENCES public.opcion( id_opcion )   
 );

CREATE  TABLE public.tipo_acogida ( 
	id_tipo_acogida      serial  NOT NULL  ,
	des_acogida          varchar  NOT NULL  ,
	CONSTRAINT pk_tipo_acogida PRIMARY KEY ( id_tipo_acogida )
 );

CREATE  TABLE public.usuario ( 
	id_usuario           serial  NOT NULL  ,
	nom_usuario          varchar  NOT NULL  ,
	pwd_usuario          varchar  NOT NULL  ,
	tlf_usuario          varchar  NOT NULL  ,
	email_usuario        varchar  NOT NULL  ,
	id_perfil            serial    ,
	CONSTRAINT pk_usuario PRIMARY KEY ( id_usuario ),
	CONSTRAINT fk_usuario_perfil FOREIGN KEY ( id_perfil ) REFERENCES public.perfil( id_perfil )   
 );

CREATE  TABLE public.acogida ( 
	id_acogida           serial  NOT NULL  ,
	fecha_acogida        date  NOT NULL  ,
	id_tipo_acogida      serial    ,
	id_animal            serial    ,
	id_usuario           serial    ,
	CONSTRAINT pk_acogida PRIMARY KEY ( id_acogida ),
	CONSTRAINT fk_acogida_tipo_acogida FOREIGN KEY ( id_tipo_acogida ) REFERENCES public.tipo_acogida( id_tipo_acogida )   ,
	CONSTRAINT fk_acogida_animal FOREIGN KEY ( id_animal ) REFERENCES public.animal( id_animal )   ,
	CONSTRAINT fk_acogida_usuario FOREIGN KEY ( id_usuario ) REFERENCES public.usuario( id_usuario )   
 );

CREATE  TABLE public.historial ( 
	id_historial         serial  NOT NULL  ,
	des_historial        varchar  NOT NULL  ,
	id_usuario           serial    ,
	id_animal            serial    ,
	CONSTRAINT pk_historial PRIMARY KEY ( id_historial ),
	CONSTRAINT fk_historial_usuario FOREIGN KEY ( id_usuario ) REFERENCES public.usuario( id_usuario )   ,
	CONSTRAINT fk_historial_animal FOREIGN KEY ( id_animal ) REFERENCES public.animal( id_animal )   
 );

CREATE  TABLE public.historial_diagnostico ( 
	id_historial_diagnostico serial  NOT NULL  ,
	des_diagnostico      serial    ,
	id_historial         serial    ,
	CONSTRAINT pk_historial_diagnostico PRIMARY KEY ( id_historial_diagnostico ),
	CONSTRAINT fk_historial_diagnostico_historial FOREIGN KEY ( id_historial ) REFERENCES public.historial( id_historial )   
 );

CREATE  TABLE public.historial_medicamento ( 
	id_historial_medicamento serial  NOT NULL  ,
	des_medicamento      serial    ,
	id_historial         serial    ,
	CONSTRAINT pk_historial_medicamento PRIMARY KEY ( id_historial_medicamento ),
	CONSTRAINT fk_historial_medicamento_historial FOREIGN KEY ( id_historial ) REFERENCES public.historial( id_historial )   
 );

CREATE  TABLE public.historial_tratamiento ( 
	id_historial_tratamiento serial  NOT NULL  ,
	des_tratamiento      serial    ,
	id_historial         serial    ,
	CONSTRAINT pk_historial_tratamiento PRIMARY KEY ( id_historial_tratamiento ),
	CONSTRAINT fk_historial_tratamiento_historial FOREIGN KEY ( id_historial ) REFERENCES public.historial( id_historial )   
 );
