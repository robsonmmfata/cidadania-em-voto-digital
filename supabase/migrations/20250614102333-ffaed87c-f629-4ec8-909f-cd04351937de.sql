
-- 1. Enum de papéis dos usuários
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Tabela de perfis públicos (linkada ao auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabela para papéis de usuários
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  unique (user_id, role)
);

-- Função de segurança para RLS com papéis
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. Tabela de votações criadas pelo ADMIN
CREATE TABLE public.elections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by uuid REFERENCES auth.users (id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabela de opções de voto (por votação, ex: Condenar/Absolver)
CREATE TABLE public.election_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id uuid REFERENCES public.elections(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- 6. Tabela de votos lançados
CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  election_id uuid REFERENCES public.elections(id) ON DELETE CASCADE,
  option_id uuid REFERENCES public.election_options(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, election_id)
);

-- 7. Tabela de pagamentos Pix (simples, só para salvar dados do QR e status)
CREATE TABLE public.pix_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_id uuid REFERENCES public.votes(id) ON DELETE CASCADE,
  qr_code TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pix_payments ENABLE ROW LEVEL SECURITY;

-- Políticas básicas iniciais (ajustaremos mais depois!):

-- PERFIS: Cada um só vê o seu
CREATE POLICY "Cada um vê só seu perfil"
  ON public.profiles
  USING (id = auth.uid());

-- USER_ROLES: Usuário só vê o próprio papel
CREATE POLICY "Usuário só vê seu papel"
  ON public.user_roles
  USING (user_id = auth.uid());

-- ELECTIONS: Todos podem ver, apenas admins podem criar
CREATE POLICY "Todos podem ler votações"
  ON public.elections
  FOR SELECT
  USING (true);

CREATE POLICY "Admins podem inserir votações"
  ON public.elections
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ELECTION_OPTIONS: Todo mundo lê, apenas admin insere
CREATE POLICY "Todos podem ler opções"
  ON public.election_options
  FOR SELECT
  USING (true);

CREATE POLICY "Admins podem inserir opções"
  ON public.election_options
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
  );

-- VOTES: Só o próprio usuário vê seus votos, só pode votar 1x, só pode votar em votação aberta
CREATE POLICY "Só dono acessa seu voto"
  ON public.votes
  USING (user_id = auth.uid());

CREATE POLICY "Usuário cadastrado pode votar"
  ON public.votes
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- PIX_PAYMENTS: Só usuário proprietário acessa
CREATE POLICY "Só dono acessa pagamento"
  ON public.pix_payments
  USING (user_id = auth.uid());

CREATE POLICY "Só dono registra pix"
  ON public.pix_payments
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
