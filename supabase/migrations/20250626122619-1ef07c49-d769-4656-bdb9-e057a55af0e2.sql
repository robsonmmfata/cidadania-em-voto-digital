
-- Atualizar as opções das 3 votações com nomes reais de candidatos

-- Atualizar Melhor Governador Regional com governadores atuais
DELETE FROM public.election_options WHERE election_id IN (
  SELECT id FROM public.elections WHERE name = 'Melhor Governador Regional'
);

INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  option_data.label,
  option_data.value,
  option_data.display_order
FROM public.elections e,
(VALUES 
  ('Tarcísio de Freitas (Republicanos-SP)', 'tarcisio-freitas', 1),
  ('Cláudio Castro (PL-RJ)', 'claudio-castro', 2),
  ('Romeu Zema (Novo-MG)', 'romeu-zema', 3),
  ('Jerônimo Rodrigues (PT-BA)', 'jeronimo-rodrigues', 4),
  ('Eduardo Leite (PSDB-RS)', 'eduardo-leite', 5)
) AS option_data(label, value, display_order)
WHERE e.name = 'Melhor Governador Regional';

-- Atualizar Reforma Política Brasileira com líderes políticos conhecidos
DELETE FROM public.election_options WHERE election_id IN (
  SELECT id FROM public.elections WHERE name = 'Reforma Política Brasileira'
);

INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  option_data.label,
  option_data.value,
  option_data.display_order
FROM public.elections e,
(VALUES 
  ('Arthur Lira (PP-AL) – Presidente da Câmara', 'arthur-lira', 1),
  ('Gilmar Mendes (STF) – Ministro do STF', 'gilmar-mendes', 2),
  ('José de Anchieta Júnior (PSDB) – Advogado', 'anchieta-junior', 3),
  ('Marcos Pereira (Republicanos-SP)', 'marcos-pereira', 4),
  ('Renan Calheiros (MDB-AL)', 'renan-calheiros', 5)
) AS option_data(label, value, display_order)
WHERE e.name = 'Reforma Política Brasileira';

-- Atualizar Prioridades para o Brasil com líderes políticos
DELETE FROM public.election_options WHERE election_id IN (
  SELECT id FROM public.elections WHERE name = 'Prioridades para o Brasil'
);

INSERT INTO public.election_options (election_id, label, value, display_order)
SELECT 
  e.id,
  option_data.label,
  option_data.value,
  option_data.display_order
FROM public.elections e,
(VALUES 
  ('Luiz Inácio Lula da Silva (PT) – Presidente', 'lula-silva', 1),
  ('Fernando Haddad (PT) – Ministro da Fazenda', 'fernando-haddad', 2),
  ('Ciro Gomes (PDT-CE)', 'ciro-gomes', 3),
  ('Marina Silva (Rede-AC) – Ministra do Meio Ambiente', 'marina-silva', 4),
  ('Jair Bolsonaro (PL-RJ) – Ex-presidente', 'jair-bolsonaro', 5)
) AS option_data(label, value, display_order)
WHERE e.name = 'Prioridades para o Brasil';
