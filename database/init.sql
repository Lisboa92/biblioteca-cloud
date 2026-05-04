-- Inicialização da BD da Biblioteca (executado automaticamente pelo container Postgres)
CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150) NOT NULL,
    ano INTEGER CHECK (ano > 0 AND ano <= 2100),
    genero VARCHAR(80),
    disponivel BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO livros (titulo, autor, ano, genero) VALUES
('Niketche', 'Paulina Chiziane', 2002, 'Romance'),
('Terra Sonâmbula', 'Mia Couto', 1992, 'Romance'),
('Os Lusíadas', 'Luís de Camões', 1572, 'Épico'),
('Clean Code', 'Robert C. Martin', 2008, 'Técnico');
