
-- Primeiro, vamos deletar as opções das votações que serão removidas
DELETE FROM public.election_options 
WHERE election_id IN (
  SELECT id FROM public.elections 
  WHERE name IN (
    'Melhor Jogador de Futebol',
    'Melhor Filme do Ano', 
    'Melhor Série de TV',
    'Melhor Restaurante da Cidade',
    'Melhor Aplicativo do Ano'
  )
);

-- Depois deletar as votações indesejadas
DELETE FROM public.elections 
WHERE name IN (
  'Melhor Jogador de Futebol',
  'Melhor Filme do Ano', 
  'Melhor Série de TV',
  'Melhor Restaurante da Cidade',
  'Melhor Aplicativo do Ano'
);
