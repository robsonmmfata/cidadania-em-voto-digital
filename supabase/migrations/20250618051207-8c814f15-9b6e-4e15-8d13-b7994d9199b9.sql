
-- Inserir 10 votações de exemplo
INSERT INTO public.elections (name, description, starts_at, ends_at) VALUES
('Presidente do Brasil 2024', 'Eleição presidencial do Brasil para o mandato 2025-2029', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Melhor Jogador de Futebol', 'Vote no melhor jogador de futebol da atualidade', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Prefeito de São Paulo', 'Eleição municipal para prefeito de São Paulo', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Melhor Filme do Ano', 'Escolha o melhor filme lançado este ano', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Governador do Rio de Janeiro', 'Eleição estadual para governador do RJ', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Melhor Série de TV', 'Vote na melhor série de televisão atual', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Senador Federal', 'Eleição para senador federal por São Paulo', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Melhor Restaurante da Cidade', 'Escolha o melhor restaurante da sua cidade', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Deputado Estadual', 'Eleição para deputado estadual de São Paulo', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Melhor Aplicativo do Ano', 'Vote no aplicativo mais útil do ano', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00');

-- Inserir opções para a primeira votação (Presidente do Brasil)
INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  option_data.label,
  option_data.value,
  option_data.display_order
FROM public.elections e,
(VALUES 
  ('Luiz Inácio Lula da Silva', 'lula', 1),
  ('Jair Bolsonaro', 'bolsonaro', 2),
  ('Ciro Gomes', 'ciro', 3),
  ('Simone Tebet', 'tebet', 4)
) AS option_data(label, value, display_order)
WHERE e.name = 'Presidente do Brasil 2024';

-- Inserir opções para a segunda votação (Melhor Jogador)
INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  option_data.label,
  option_data.value,
  option_data.display_order
FROM public.elections e,
(VALUES 
  ('Lionel Messi', 'messi', 1),
  ('Cristiano Ronaldo', 'ronaldo', 2),
  ('Neymar Jr.', 'neymar', 3),
  ('Kylian Mbappé', 'mbappe', 4)
) AS option_data(label, value, display_order)
WHERE e.name = 'Melhor Jogador de Futebol';

-- Inserir opções para a terceira votação (Prefeito SP)
INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  option_data.label,
  option_data.value,
  option_data.display_order
FROM public.elections e,
(VALUES 
  ('Ricardo Nunes', 'nunes', 1),
  ('Guilherme Boulos', 'boulos', 2),
  ('José Luiz Datena', 'datena', 3),
  ('Tabata Amaral', 'tabata', 4)
) AS option_data(label, value, display_order)
WHERE e.name = 'Prefeito de São Paulo';

-- Inserir opções para as demais votações (opções genéricas)
INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  'Opção ' || generate_series(1, 4),
  'opcao_' || generate_series(1, 4),
  generate_series(1, 4)
FROM public.elections e
WHERE e.name IN (
  'Melhor Filme do Ano',
  'Governador do Rio de Janeiro', 
  'Melhor Série de TV',
  'Senador Federal',
  'Melhor Restaurante da Cidade',
  'Deputado Estadual',
  'Melhor Aplicativo do Ano'
);
