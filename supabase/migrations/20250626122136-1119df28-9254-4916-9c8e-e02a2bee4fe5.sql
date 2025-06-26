
-- Primeiro, vamos limpar as votações existentes e suas opções
DELETE FROM public.election_options;
DELETE FROM public.elections;

-- Inserir as 5 novas votações
INSERT INTO public.elections (name, description, starts_at, ends_at) VALUES
('Senadores Federais do Brasil', 'Vote no senador federal que você considera mais importante para o país', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Candidatos ao Senado Federal - Rio de Janeiro', 'Escolha o melhor candidato ao Senado Federal pelo Rio de Janeiro', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Melhor Governador Regional', 'Vote no melhor governador da sua região', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Reforma Política Brasileira', 'Qual reforma política você considera mais urgente?', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00'),
('Prioridades para o Brasil', 'Qual deve ser a principal prioridade do governo federal?', '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00');

-- Inserir opções para Senadores Federais do Brasil
INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  option_data.label,
  option_data.value,
  option_data.display_order
FROM public.elections e,
(VALUES 
  ('Rodrigo Pacheco (PSD-MG) – Presidente do Senado', 'rodrigo-pacheco', 1),
  ('Jaques Wagner (PT-BA)', 'jaques-wagner', 2),
  ('Damares Alves (Republicanos-DF)', 'damares-alves', 3),
  ('Sergio Moro (União-PR)', 'sergio-moro', 4),
  ('Flávio Bolsonaro (PL-RJ)', 'flavio-bolsonaro', 5)
) AS option_data(label, value, display_order)
WHERE e.name = 'Senadores Federais do Brasil';

-- Inserir opções para Candidatos ao Senado Federal - Rio de Janeiro
INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  option_data.label,
  option_data.value,
  option_data.display_order
FROM public.elections e,
(VALUES 
  ('Romário (PL) – Atual senador pelo RJ', 'romario', 1),
  ('Alessandro Molon (PSB)', 'alessandro-molon', 2),
  ('Daniel Silveira (PTB)', 'daniel-silveira', 3),
  ('Clarissa Garotinho (União Brasil)', 'clarissa-garotinho', 4),
  ('André Ceciliano (PT)', 'andre-ceciliano', 5)
) AS option_data(label, value, display_order)
WHERE e.name = 'Candidatos ao Senado Federal - Rio de Janeiro';

-- Inserir opções para as demais votações
INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  option_data.label,
  option_data.value,
  option_data.display_order
FROM public.elections e,
(VALUES 
  ('Governador de São Paulo', 'sp-gov', 1),
  ('Governador do Rio de Janeiro', 'rj-gov', 2),
  ('Governador de Minas Gerais', 'mg-gov', 3),
  ('Governador da Bahia', 'ba-gov', 4),
  ('Governador do Rio Grande do Sul', 'rs-gov', 5)
) AS option_data(label, value, display_order)
WHERE e.name = 'Melhor Governador Regional';

INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  option_data.label,
  option_data.value,
  option_data.display_order
FROM public.elections e,
(VALUES 
  ('Reforma do Sistema Eleitoral', 'reforma-eleitoral', 1),
  ('Reforma Tributária', 'reforma-tributaria', 2),
  ('Reforma da Previdência', 'reforma-previdencia', 3),
  ('Reforma Administrativa', 'reforma-administrativa', 4),
  ('Reforma do Judiciário', 'reforma-judiciario', 5)
) AS option_data(label, value, display_order)
WHERE e.name = 'Reforma Política Brasileira';

INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  option_data.label,
  option_data.value,
  option_data.display_order
FROM public.elections e,
(VALUES 
  ('Combate à Corrupção', 'combate-corrupcao', 1),
  ('Melhoria da Saúde Pública', 'saude-publica', 2),
  ('Investimento em Educação', 'educacao', 3),
  ('Geração de Empregos', 'geracao-empregos', 4),
  ('Combate à Violência', 'combate-violencia', 5)
) AS option_data(label, value, display_order)
WHERE e.name = 'Prioridades para o Brasil';
