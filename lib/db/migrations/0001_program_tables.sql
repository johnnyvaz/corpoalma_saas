
-- Add program fields to users table
ALTER TABLE users ADD COLUMN current_week INTEGER DEFAULT 1 NOT NULL;
ALTER TABLE users ADD COLUMN program_start_date TIMESTAMP;
ALTER TABLE users ADD COLUMN program_completed BOOLEAN DEFAULT false NOT NULL;

-- Create weekly themes table
CREATE TABLE weekly_themes (
    id SERIAL PRIMARY KEY,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    bible_verse TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

-- Create daily tasks table
CREATE TABLE daily_tasks (
    id SERIAL PRIMARY KEY,
    week_number INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    audio_url TEXT,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

-- Create user progress table
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    week_number INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    notes TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

-- Create weight tracking table
CREATE TABLE weight_tracking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    weight DECIMAL(5,2) NOT NULL,
    week_number INTEGER NOT NULL,
    recorded_at TIMESTAMP DEFAULT now() NOT NULL
);

-- Create testimonials table
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    week_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

-- Insert initial weekly themes
INSERT INTO weekly_themes (week_number, title, description, bible_verse) VALUES
(1, 'Amor Próprio e o Templo do Espírito Santo', 'Compreendendo que nosso corpo é templo do Espírito Santo e merece cuidado e respeito.', '1 Coríntios 6:19 - Ou não sabeis que o nosso corpo é o templo do Espírito Santo, que habita em vós?'),
(2, 'A Glutonaria e o Controle Emocional', 'Aprendendo a distinguir entre fome física e emocional, desenvolvendo autocontrole.', 'Provérbios 25:28 - Como a cidade derrubada, que não tem muros, assim é o homem que não pode conter o seu espírito.'),
(3, 'Hidratação, Descanso e Espírito', 'A importância do descanso e hidratação para o bem-estar físico e espiritual.', 'Salmos 23:2 - Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.'),
(4, 'Disciplina, Jejum e Exercício', 'Desenvolvendo disciplina através do jejum e exercícios físicos como forma de adoração.', '1 Coríntios 9:27 - Antes subjugo o meu corpo, e o reduzo à servidão, para que, pregando aos outros, eu mesmo não venha de alguma maneira a ficar reprovado.'),
(5, 'Renovação da Mente e Perseverança', 'Renovando nossa mentalidade sobre saúde e mantendo a perseverança na jornada.', 'Romanos 12:2 - E não sede conformados com este mundo, mas sede transformados pela renovação do vosso entendimento.');
