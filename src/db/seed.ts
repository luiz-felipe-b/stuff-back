import { db } from './connection.ts';
import { organizations } from './schemas/organizations.schema.ts';
import { assets } from './schemas/assets/assets.schema.ts';
import { attributes } from './schemas/assets/attributes/attributes.schema.ts';
import { attributeValues } from './schemas/assets/attributes/attribute-values.schema.ts';
import { users } from './schemas/users.schema.ts';
import { usersOrganizations } from './schemas/users-organizations.schema.ts';
import argon2 from 'argon2';
import { env } from '../env.ts';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
        // ...existing code...
    // ...existing code...
    // Seed user-organization relations (after users/orgs are created)
    // This block should be after orgIds and userIds are populated

    if (env.NODE_ENV === 'production') {
        console.error('Seeding is not allowed in production environment.');
        return;
    }

    console.log('🌱 Seeding database...');

    try {
        // Optional DB reset: use --reset CLI flag to clear tables before seeding
        const shouldReset = process.argv.includes('--reset');
        if (shouldReset) {
            await db.delete(attributeValues);
            await db.delete(attributes);
            await db.delete(assets);
            await db.delete(organizations);
            await db.delete(users);
            console.log('🧹 Database reset before seeding.');
        }

        // Create admin user
    const adminPassword = await argon2.hash('admin123');
    const adminId = '00000000-0000-0000-0000-000000000000';
        await db.insert(users).values({
            id: adminId,
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin',
            active: true,
            authenticated: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }).onConflictDoNothing();


        // Create more users
        const password = await argon2.hash('password123');
        const userIds: string[] = [];
        const sampleUsers = [
            { firstName: 'João', lastName: 'Silva', email: 'joao.silva@example.com' },
            { firstName: 'Maria', lastName: 'Oliveira', email: 'maria.oliveira@example.com' },
            { firstName: 'Pedro', lastName: 'Santos', email: 'pedro.santos@example.com' },
            { firstName: 'Ana', lastName: 'Souza', email: 'ana.souza@example.com' },
            { firstName: 'Lucas', lastName: 'Ferreira', email: 'lucas.ferreira@example.com' },
            { firstName: 'Juliana', lastName: 'Almeida', email: 'juliana.almeida@example.com' },
            { firstName: 'Gabriel', lastName: 'Costa', email: 'gabriel.costa@example.com' },
            { firstName: 'Fernanda', lastName: 'Ribeiro', email: 'fernanda.ribeiro@example.com' },
            { firstName: 'Rafael', lastName: 'Martins', email: 'rafael.martins@example.com' },
            { firstName: 'Camila', lastName: 'Barbosa', email: 'camila.barbosa@example.com' },
            { firstName: 'Bruno', lastName: 'Rocha', email: 'bruno.rocha@example.com' },
            { firstName: 'Patrícia', lastName: 'Lima', email: 'patricia.lima@example.com' },
            { firstName: 'Felipe', lastName: 'Gomes', email: 'felipe.gomes@example.com' },
            { firstName: 'Larissa', lastName: 'Carvalho', email: 'larissa.carvalho@example.com' },
            { firstName: 'Diego', lastName: 'Azevedo', email: 'diego.azevedo@example.com' },
            { firstName: 'Aline', lastName: 'Teixeira', email: 'aline.teixeira@example.com' },
            { firstName: 'Vinícius', lastName: 'Melo', email: 'vinicius.melo@example.com' },
            { firstName: 'Beatriz', lastName: 'Pereira', email: 'beatriz.pereira@example.com' },
            { firstName: 'Rodrigo', lastName: 'Nascimento', email: 'rodrigo.nascimento@example.com' },
            { firstName: 'Cláudia', lastName: 'Ramos', email: 'claudia.ramos@example.com' }
        ];
        for (const user of sampleUsers) {
            const id = uuidv4();
            userIds.push(id);
            await db.insert(users).values({
                id,
                ...user,
                password,
                role: 'user',
                active: true,
                authenticated: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }).onConflictDoNothing();
        }

        // Create more organizations
        const orgIds: string[] = [];
        const orgSamples = [
            { name: 'TechSul', slug: 'techsul', description: 'Empresa de tecnologia do sul do Brasil' },
            { name: 'Doces Aurora', slug: 'doces-aurora', description: 'Fábrica de doces e chocolates' },
            { name: 'Construtora Brasil', slug: 'construtora-brasil', description: 'Construtora de obras civis' },
            { name: 'Clínica Vida', slug: 'clinica-vida', description: 'Clínica médica e odontológica' },
            { name: 'Auto Peças União', slug: 'auto-pecas-uniao', description: 'Distribuidora de autopeças' },
            { name: 'Café Mineiro', slug: 'cafe-mineiro', description: 'Cafeteria tradicional' },
            { name: 'Escola Saber', slug: 'escola-saber', description: 'Escola de ensino fundamental e médio' },
            { name: 'AgroVerde', slug: 'agroverde', description: 'Cooperativa agrícola' },
            { name: 'Pousada Mar Azul', slug: 'pousada-mar-azul', description: 'Pousada à beira-mar' },
            { name: 'Studio Criativo', slug: 'studio-criativo', description: 'Agência de design e publicidade' }
        ];
        for (let i = 0; i < orgSamples.length; i++) {
            const id = uuidv4();
            orgIds.push(id);
            await db.insert(organizations).values({
                id,
                ownerId: adminId,
                name: orgSamples[i].name,
                slug: orgSamples[i].slug,
                password: null,
                description: orgSamples[i].description,
                active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }).onConflictDoNothing();
        }

        // Assign users to organizations (randomly, with varied roles)
        const orgRoles = ['admin', 'moderator', 'user'];
        for (const userId of userIds) {
            // Each user gets 2-4 orgs
            const orgCount = 2 + Math.floor(Math.random() * 3);
            const shuffledOrgs = orgIds.slice().sort(() => Math.random() - 0.5);
            for (let i = 0; i < orgCount; i++) {
                const orgId = shuffledOrgs[i];
                const role = orgRoles[Math.floor(Math.random() * orgRoles.length)];
                await db.insert(usersOrganizations).values({
                    userId,
                    organizationId: orgId,
                    role,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }).onConflictDoNothing();
            }
        }

        // Seed assets (more variety, assign to different users)
        const assetIds: string[] = [];
        const assetSamples = [
            { type: 'unique', name: 'Carro da Empresa', description: 'Veículo exclusivo da empresa', quantity: 1 },
            { type: 'replicable', name: 'Notebook', description: 'Notebooks dos colaboradores', quantity: 10 },
            { type: 'unique', name: 'Servidor Principal', description: 'Servidor principal da infraestrutura', quantity: 1 },
            { type: 'replicable', name: 'Crachá RFID', description: 'Crachás de acesso dos funcionários', quantity: 50 },
            { type: 'unique', name: 'TV da Sala de Reunião', description: 'Televisão da sala de reuniões', quantity: 1 },
            { type: 'unique', name: 'Impressora 3D', description: 'Impressora 3D do escritório', quantity: 1 },
            { type: 'replicable', name: 'Cadeira de Escritório', description: 'Cadeiras ergonômicas', quantity: 30 },
            { type: 'replicable', name: 'Monitor', description: 'Monitores de 24 polegadas', quantity: 20 },
            { type: 'unique', name: 'Balcão de Recepção', description: 'Balcão da recepção', quantity: 1 },
            { type: 'replicable', name: 'Celular Corporativo', description: 'Celulares da empresa', quantity: 15 },
            { type: 'unique', name: 'Projetor', description: 'Projetor da sala de reuniões', quantity: 1 },
            { type: 'replicable', name: 'Tablet', description: 'Tablets dos colaboradores', quantity: 8 },
            { type: 'unique', name: 'Cafeteira', description: 'Cafeteira da copa', quantity: 1 },
            { type: 'replicable', name: 'Quadro Branco', description: 'Quadros brancos das salas', quantity: 5 },
            { type: 'unique', name: 'Switch de Rede', description: 'Switch principal da rede', quantity: 1 },
            { type: 'replicable', name: 'Luminária de Mesa', description: 'Luminárias de LED para mesas', quantity: 25 },
            { type: 'unique', name: 'Extintor de Incêndio', description: 'Extintor principal', quantity: 1 },
            { type: 'replicable', name: 'Pen Drive', description: 'Pen drives da empresa', quantity: 40 },
            { type: 'unique', name: 'Rack de Servidor', description: 'Rack principal de servidores', quantity: 1 },
            { type: 'replicable', name: 'Roteador', description: 'Roteadores Wi-Fi', quantity: 3 }
        ];
        const assetInsertData: any[] = [];
        for (let i = 0; i < assetSamples.length; i++) {
            const id = uuidv4();
            assetIds.push(id);
            // Assign creatorUserId round-robin: admin + all users
            const creatorUserId = i % (userIds.length + 1) === 0 ? adminId : userIds[(i - 1) % userIds.length];
            assetInsertData.push({
                id,
                type: assetSamples[i].type,
                quantity: assetSamples[i].quantity,
                organizationId: orgIds[i % orgIds.length],
                creatorUserId,
                name: assetSamples[i].name,
                description: assetSamples[i].description,
                trashBin: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await db.insert(assets).values(assetInsertData).onConflictDoNothing();

        // --- User-Asset relations ---
        // If you want true many-to-many user-asset relations, create a users_assets join table and seed it here.
        // Example:
        // for (let i = 0; i < assetIds.length; i++) {
        //   for (let j = 0; j < userIds.length; j++) {
        //     if (Math.random() < 0.3) { // 30% chance user owns asset
        //       await db.insert(usersAssets).values({ userId: userIds[j], assetId: assetIds[i] });
        //     }
        //   }
        // }

        // Seed attributes
        const attributeIds: string[] = [];
        // Expanded and categorized attribute samples
        const attributeSamples = [
            // Gerais
            { name: 'Número de Série', description: 'Número de série do equipamento', type: 'text' },
            { name: 'Data de Compra', description: 'Data da compra', type: 'date' },
            { name: 'Garantia Até', description: 'Data de expiração da garantia', type: 'date' },
            { name: 'Cor', description: 'Cor do ativo', type: 'text' },
            { name: 'Localização', description: 'Local físico', type: 'text' },
            { name: 'Departamento Responsável', description: 'Departamento responsável pelo ativo', type: 'select', options: JSON.stringify(['RH', 'TI', 'Financeiro', 'Vendas']) },
            { name: 'Usuário Responsável', description: 'Usuário responsável pelo ativo', type: 'text' },
            { name: 'Está Ativo', description: 'O ativo está ativo?', type: 'boolean' },
            { name: 'Última Manutenção', description: 'Data da última manutenção', type: 'date' },
            // Veículos
            { name: 'Placa', description: 'Placa do veículo', type: 'text' },
            { name: 'Quilometragem', description: 'Quilometragem do veículo', type: 'number' },
            { name: 'Tipo de Combustível', description: 'Tipo de combustível', type: 'select', options: JSON.stringify(['Gasolina', 'Diesel', 'Elétrico', 'Flex']) },
            // TI/Informática
            { name: 'Memória RAM', description: 'Memória RAM em GB', type: 'number' },
            { name: 'Armazenamento', description: 'Armazenamento em GB', type: 'number' },
            { name: 'Sistema Operacional', description: 'Sistema operacional', type: 'select', options: JSON.stringify(['Windows', 'macOS', 'Linux', 'Android', 'iOS']) },
            { name: 'Processador', description: 'Modelo do processador', type: 'text' },
            { name: 'Saúde da Bateria', description: 'Saúde da bateria (%)', type: 'number' },
            { name: 'Tamanho da Tela', description: 'Tamanho da tela em polegadas', type: 'number' },
            { name: 'Possui Touchscreen', description: 'Possui tela sensível ao toque?', type: 'boolean' },
            { name: 'Endereço MAC', description: 'Endereço MAC de rede', type: 'text' },
            { name: 'Endereço IP', description: 'Endereço IP do dispositivo', type: 'text' },
            { name: 'Consumo de Energia', description: 'Consumo em watts', type: 'number' },
            { name: 'Versão do Firmware', description: 'Versão do firmware', type: 'text' },
            { name: 'Tempo Ligado', description: 'Tempo de funcionamento do dispositivo', type: 'timemetric', timeUnit: 'segundos' },
            // Escritório/Instalações
            { name: 'Peso', description: 'Peso em quilogramas', type: 'metric', unit: 'kg' },
            { name: 'Acessórios', description: 'Acessórios inclusos', type: 'multiselection', options: JSON.stringify(['Mouse', 'Carregador', 'Bolsa', 'Suporte', 'Cabo']) },
            { name: 'Manual', description: 'URL do manual do ativo', type: 'file' },
            { name: 'Tag RFID', description: 'Identificação RFID', type: 'rfid' },
            { name: 'Vistoria de Incêndio', description: 'Aprovado na vistoria de incêndio', type: 'boolean' },
            { name: 'Sala', description: 'Número da sala', type: 'text' },
            { name: 'Lumens do Projetor', description: 'Brilho do projetor', type: 'number' },
            { name: 'Portas do Switch', description: 'Quantidade de portas', type: 'number' },
            { name: 'Tipo de Café', description: 'Tipo de café da cafeteira', type: 'select', options: JSON.stringify(['Expresso', 'Coado', 'Cápsula']) },
            { name: 'Tamanho do Quadro Branco', description: 'Tamanho do quadro branco em cm', type: 'number' },
            { name: 'Lumens da Luminária', description: 'Brilho da luminária em lumens', type: 'number' },
            { name: 'Possui Caneta', description: 'Tablet possui caneta?', type: 'boolean' },
            { name: 'Número do Crachá', description: 'Número do crachá RFID', type: 'text' },
            { name: 'Unidades do Rack', description: 'Tamanho do rack em U', type: 'number' },
            { name: 'Banda do Roteador', description: 'Banda do Wi-Fi', type: 'select', options: JSON.stringify(['2.4GHz', '5GHz', 'Dual']) }
        ];
        const attributeInsertData: any[] = [];
        for (let i = 0; i < attributeSamples.length; i++) {
            const id = uuidv4();
            attributeIds.push(id);
            const attr = attributeSamples[i];
            // Ensure all metric attributes have a unit
            let unit = attr.unit || null;
            if (attr.type === 'metric' && !unit) {
                unit = 'unit'; // Default unit if not specified
            }
            attributeInsertData.push({
                id,
                organizationId: orgIds[i % orgIds.length],
                authorId: adminId,
                name: attr.name,
                description: attr.description,
                type: attr.type,
                options: attr.options || null,
                unit,
                timeUnit: attr.timeUnit || null,
                required: false,
                trashBin: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await db.insert(attributes).values(attributeInsertData).onConflictDoNothing();

        // Seed attribute values with correct types (all as strings)
        // Mapeamento de nomes de ativos para atributos relevantes (tudo em português)
        const assetAttributeMap: Record<string, string[]> = {
            'Carro da Empresa': ['Placa', 'Quilometragem', 'Tipo de Combustível', 'Cor', 'Data de Compra', 'Garantia Até', 'Está Ativo', 'Departamento Responsável', 'Usuário Responsável'],
            'Notebook': ['Número de Série', 'Memória RAM', 'Armazenamento', 'Sistema Operacional', 'Processador', 'Saúde da Bateria', 'Tamanho da Tela', 'Possui Touchscreen', 'Endereço MAC', 'Endereço IP', 'Consumo de Energia', 'Acessórios', 'Manual', 'Garantia Até', 'Data de Compra', 'Departamento Responsável', 'Usuário Responsável'],
            'Servidor Principal': ['Número de Série', 'Memória RAM', 'Armazenamento', 'Processador', 'Tempo Ligado', 'Consumo de Energia', 'Versão do Firmware', 'Endereço MAC', 'Endereço IP', 'Sala', 'Unidades do Rack', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Crachá RFID': ['Número do Crachá', 'Tag RFID', 'Usuário Responsável', 'Está Ativo', 'Data de Compra'],
            'TV da Sala de Reunião': ['Número de Série', 'Tamanho da Tela', 'Consumo de Energia', 'Sala', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Impressora 3D': ['Número de Série', 'Versão do Firmware', 'Consumo de Energia', 'Acessórios', 'Sala', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Cadeira de Escritório': ['Cor', 'Peso', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Monitor': ['Número de Série', 'Tamanho da Tela', 'Consumo de Energia', 'Possui Touchscreen', 'Endereço MAC', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Balcão de Recepção': ['Cor', 'Peso', 'Sala', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Celular Corporativo': ['Número de Série', 'Sistema Operacional', 'Saúde da Bateria', 'Tamanho da Tela', 'Possui Touchscreen', 'Endereço MAC', 'Endereço IP', 'Acessórios', 'Manual', 'Garantia Até', 'Data de Compra', 'Usuário Responsável'],
            'Projetor': ['Número de Série', 'Lumens do Projetor', 'Consumo de Energia', 'Sala', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Tablet': ['Número de Série', 'Sistema Operacional', 'Saúde da Bateria', 'Tamanho da Tela', 'Possui Touchscreen', 'Acessórios', 'Possui Caneta', 'Manual', 'Garantia Até', 'Data de Compra', 'Usuário Responsável'],
            'Cafeteira': ['Número de Série', 'Tipo de Café', 'Consumo de Energia', 'Sala', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Quadro Branco': ['Tamanho do Quadro Branco', 'Sala', 'Data de Compra', 'Departamento Responsável'],
            'Switch de Rede': ['Número de Série', 'Portas do Switch', 'Consumo de Energia', 'Endereço MAC', 'Versão do Firmware', 'Sala', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Luminária de Mesa': ['Lumens da Luminária', 'Cor', 'Sala', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Extintor de Incêndio': ['Número de Série', 'Vistoria de Incêndio', 'Sala', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Pen Drive': ['Número de Série', 'Armazenamento', 'Data de Compra', 'Garantia Até', 'Usuário Responsável'],
            'Rack de Servidor': ['Número de Série', 'Unidades do Rack', 'Sala', 'Data de Compra', 'Garantia Até', 'Departamento Responsável'],
            'Roteador': ['Número de Série', 'Banda do Roteador', 'Endereço MAC', 'Endereço IP', 'Versão do Firmware', 'Consumo de Energia', 'Sala', 'Data de Compra', 'Garantia Até', 'Departamento Responsável']
        };

        // Helper pools for more realistic values
        const textPool = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Juliana', 'Gabriel', 'Fernanda', 'Rafael', 'Camila', 'Bruno', 'Patrícia', 'Felipe', 'Larissa', 'Diego', 'Aline', 'Vinícius', 'Beatriz', 'Rodrigo', 'Cláudia'];
        const colorPool = ['Vermelho', 'Azul', 'Verde', 'Preto', 'Branco', 'Cinza', 'Amarelo', 'Roxo', 'Laranja', 'Prata', 'Dourado'];
        const departmentPool = ['RH', 'TI', 'Financeiro', 'Vendas'];
        const userPool = sampleUsers.map(u => u.firstName + ' ' + u.lastName);
        const roomPool = ['Sala 101', 'Sala 102', 'Sala 201', 'Sala 202', 'Sala 301', 'Auditório', 'Recepção', 'Copa', 'Sala de Reunião', 'Diretoria', 'Laboratório'];
        const processorPool = ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1', 'Apple M2'];
        const filePool = ['manual.pdf', 'guia.pdf', 'especificacao.pdf', 'garantia.pdf', 'configuracao.pdf'];
        function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
        function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
        function randomDate(start: Date, end: Date): string { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString(); }

        // Track which attributes got at least one value
        const attributesWithValues = new Set<number>();
        for (let i = 0; i < assetIds.length; i++) {
            const assetName = assetSamples[i].name;
            const relevantAttrs = assetAttributeMap[assetName] || [];
            for (let j = 0; j < attributeIds.length; j++) {
                const attr = attributeSamples[j];
                if (!relevantAttrs.includes(attr.name)) continue;
                attributesWithValues.add(j);
                let value: string | number;
                switch (attr.name) {
                    case 'Número de Série':
                        value = `${randomFrom(textPool)}-${randomInt(10000,99999)}`;
                        break;
                    case 'Placa':
                        value = `${String.fromCharCode(65+randomInt(0,25))}${String.fromCharCode(65+randomInt(0,25))}${String.fromCharCode(65+randomInt(0,25))}-${randomInt(1000,9999)}`;
                        break;
                    case 'Número do Crachá':
                        value = `CRACHA-${randomInt(1000,9999)}`;
                        break;
                    case 'Sala':
                        value = randomFrom(['101', '102', '201', '202', '301', 'A1', 'B2', 'C3', 'D4', 'Sala de Reunião', 'Recepção', 'Copa']);
                        break;
                    case 'Processador':
                        value = randomFrom(processorPool);
                        break;
                    case 'Cor':
                        value = randomFrom(colorPool);
                        break;
                    case 'Departamento Responsável':
                        value = randomFrom(departmentPool);
                        break;
                    case 'Usuário Responsável':
                        value = randomFrom(userPool);
                        break;
                    case 'Manual':
                        value = `https://exemplo.com/manuais/${randomFrom(filePool)}`;
                        break;
                    case 'Tag RFID':
                        value = `RFID-${randomInt(10000,99999)}`;
                        break;
                    case 'Endereço MAC':
                        value = `00:${randomInt(10,99)}:${randomInt(10,99)}:${randomInt(10,99)}:${randomInt(10,99)}:${randomInt(10,99)}`;
                        break;
                    case 'Endereço IP':
                        value = `10.0.${randomInt(0,255)}.${randomInt(1,254)}`;
                        break;
                    case 'Versão do Firmware':
                        value = `v${randomInt(1,5)}.${randomInt(0,9)}.${randomInt(0,99)}`;
                        break;
                    case 'Tipo de Café':
                        value = randomFrom(['Expresso', 'Coado', 'Cápsula']);
                        break;
                    case 'Banda do Roteador':
                        value = randomFrom(['2.4GHz', '5GHz', 'Dual']);
                        break;
                    case 'Sistema Operacional':
                        value = randomFrom(['Windows', 'macOS', 'Linux', 'Android', 'iOS']);
                        break;
                    case 'Tipo de Combustível':
                        value = randomFrom(['Gasolina', 'Diesel', 'Elétrico', 'Flex']);
                        break;
                    case 'Acessórios':
                        value = ['Mouse', 'Carregador', 'Bolsa', 'Suporte', 'Cabo'].filter((_, idx) => Math.random() > 0.5).join(',');
                        break;
                    case 'Possui Caneta':
                        value = Math.random() > 0.5 ? 'true' : 'false';
                        break;
                    default:
                        // fallback to type-based
                        switch (attr.type) {
                            case 'text':
                                value = `${attr.name.replace(/\s/g, '')}-${randomInt(1000,9999)}`;
                                break;
                            case 'number':
                                // Use realistic ranges for each attribute
                                if (attr.name === 'Odometer') value = randomInt(10000, 200000);
                                else if (attr.name === 'RAM Size') value = randomFrom([4, 8, 16, 32, 64]);
                                else if (attr.name === 'Storage Capacity') value = randomFrom([128, 256, 512, 1024, 2048]);
                                else if (attr.name === 'Screen Size') value = randomFrom([13, 15, 17, 21, 24, 27, 32, 55, 65]);
                                else if (attr.name === 'Battery Health') value = randomInt(60, 100);
                                else if (attr.name === 'Power Usage') value = randomInt(10, 500);
                                else if (attr.name === 'Projector Lumens') value = randomInt(1000, 5000);
                                else if (attr.name === 'Network Switch Ports') value = randomFrom([8, 16, 24, 48]);
                                else if (attr.name === 'Whiteboard Size') value = randomInt(60, 200);
                                else if (attr.name === 'Lamp Brightness') value = randomInt(200, 1200);
                                else if (attr.name === 'Server Rack Units') value = randomFrom([12, 24, 42]);
                                else value = randomInt(1, 100);
                                break;
                            case 'boolean':
                                value = Math.random() > 0.5 ? 'true' : 'false';
                                break;
                            case 'date':
                                value = randomDate(new Date(2018,0,1), new Date());
                                break;
                            case 'metric':
                                value = (Math.random() * 50 + 1).toFixed(2);
                                break;
                            case 'select':
                                if (attr.options) {
                                    const opts = JSON.parse(attr.options);
                                    value = randomFrom(opts);
                                } else {
                                    value = '';
                                }
                                break;
                            case 'multiselection':
                                if (attr.options) {
                                    const opts = JSON.parse(attr.options);
                                    value = opts.filter((_: any, idx: number) => Math.random() > 0.5).join(',');
                                } else {
                                    value = '';
                                }
                                break;
                            case 'timemetric':
                                value = randomInt(60, 86400); // 1 min to 1 day in seconds
                                break;
                            case 'file':
                                value = `https://example.com/manuals/${assetName.replace(/\s/g, '').toLowerCase()}${i + 1}.pdf`;
                                break;
                            case 'rfid':
                                value = `RFID-${randomInt(10000,99999)}`;
                                break;
                            default:
                                value = '';
                        }
                }
                await db.insert(attributeValues).values({
                    id: uuidv4(),
                    assetInstanceId: assetIds[i],
                    attributeId: attributeIds[j],
                    value: typeof value === 'number' ? value.toString() : value,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }).onConflictDoNothing();
            }
        }

        // Ensure every attribute has at least one value
        for (let j = 0; j < attributeIds.length; j++) {
            if (attributesWithValues.has(j)) continue;
            // Pick a random asset
            const i = randomInt(0, assetIds.length - 1);
            const attr = attributeSamples[j];
            let value: string | number;
            switch (attr.name) {
                case 'Número de Série':
                    value = `${randomFrom(textPool)}-${randomInt(10000,99999)}`;
                    break;
                case 'Placa':
                    value = `${String.fromCharCode(65+randomInt(0,25))}${String.fromCharCode(65+randomInt(0,25))}${String.fromCharCode(65+randomInt(0,25))}-${randomInt(1000,9999)}`;
                    break;
                case 'Número do Crachá':
                    value = `CRACHA-${randomInt(1000,9999)}`;
                    break;
                case 'Sala':
                    value = randomFrom(['101', '102', '201', '202', '301', 'A1', 'B2', 'C3', 'D4', 'Sala de Reunião', 'Recepção', 'Copa']);
                    break;
                case 'Processador':
                    value = randomFrom(processorPool);
                    break;
                case 'Cor':
                    value = randomFrom(colorPool);
                    break;
                case 'Departamento Responsável':
                    value = randomFrom(departmentPool);
                    break;
                case 'Usuário Responsável':
                    value = randomFrom(userPool);
                    break;
                case 'Manual':
                    value = `https://exemplo.com/manuais/${randomFrom(filePool)}`;
                    break;
                case 'Tag RFID':
                    value = `RFID-${randomInt(10000,99999)}`;
                    break;
                case 'Endereço MAC':
                    value = `00:${randomInt(10,99)}:${randomInt(10,99)}:${randomInt(10,99)}:${randomInt(10,99)}:${randomInt(10,99)}`;
                    break;
                case 'Endereço IP':
                    value = `10.0.${randomInt(0,255)}.${randomInt(1,254)}`;
                    break;
                case 'Versão do Firmware':
                    value = `v${randomInt(1,5)}.${randomInt(0,9)}.${randomInt(0,99)}`;
                    break;
                case 'Tipo de Café':
                    value = randomFrom(['Expresso', 'Coado', 'Cápsula']);
                    break;
                case 'Banda do Roteador':
                    value = randomFrom(['2.4GHz', '5GHz', 'Dual']);
                    break;
                case 'Sistema Operacional':
                    value = randomFrom(['Windows', 'macOS', 'Linux', 'Android', 'iOS']);
                    break;
                case 'Tipo de Combustível':
                    value = randomFrom(['Gasolina', 'Diesel', 'Elétrico', 'Flex']);
                    break;
                case 'Acessórios':
                    value = ['Mouse', 'Carregador', 'Bolsa', 'Suporte', 'Cabo'].filter((_, idx) => Math.random() > 0.5).join(',');
                    break;
                case 'Possui Caneta':
                    value = Math.random() > 0.5 ? 'true' : 'false';
                    break;
                default:
                    // fallback to type-based
                    switch (attr.type) {
                        case 'text':
                            value = `${attr.name.replace(/\s/g, '')}-${randomInt(1000,9999)}`;
                            break;
                        case 'number':
                            if (attr.name === 'Odometer') value = randomInt(10000, 200000);
                            else if (attr.name === 'RAM Size') value = randomFrom([4, 8, 16, 32, 64]);
                            else if (attr.name === 'Storage Capacity') value = randomFrom([128, 256, 512, 1024, 2048]);
                            else if (attr.name === 'Screen Size') value = randomFrom([13, 15, 17, 21, 24, 27, 32, 55, 65]);
                            else if (attr.name === 'Battery Health') value = randomInt(60, 100);
                            else if (attr.name === 'Power Usage') value = randomInt(10, 500);
                            else if (attr.name === 'Projector Lumens') value = randomInt(1000, 5000);
                            else if (attr.name === 'Network Switch Ports') value = randomFrom([8, 16, 24, 48]);
                            else if (attr.name === 'Whiteboard Size') value = randomInt(60, 200);
                            else if (attr.name === 'Lamp Brightness') value = randomInt(200, 1200);
                            else if (attr.name === 'Server Rack Units') value = randomFrom([12, 24, 42]);
                            else value = randomInt(1, 100);
                            break;
                        case 'boolean':
                            value = Math.random() > 0.5 ? 'true' : 'false';
                            break;
                        case 'date':
                            value = randomDate(new Date(2018,0,1), new Date());
                            break;
                        case 'metric':
                            value = (Math.random() * 50 + 1).toFixed(2);
                            break;
                        case 'select':
                            if (attr.options) {
                                const opts = JSON.parse(attr.options);
                                value = randomFrom(opts);
                            } else {
                                value = '';
                            }
                            break;
                        case 'multiselection':
                            if (attr.options) {
                                const opts = JSON.parse(attr.options);
                                value = opts.filter((_: any, idx: number) => Math.random() > 0.5).join(',');
                            } else {
                                value = '';
                            }
                            break;
                        case 'timemetric':
                            value = randomInt(60, 86400); // 1 min to 1 day in seconds
                            break;
                        case 'file':
                            value = `https://example.com/manuals/${assetSamples[i].name.replace(/\s/g, '').toLowerCase()}${i + 1}.pdf`;
                            break;
                        case 'rfid':
                            value = `RFID-${randomInt(10000,99999)}`;
                            break;
                        default:
                            value = '';
                    }
            }
            await db.insert(attributeValues).values({
                id: uuidv4(),
                assetInstanceId: assetIds[i],
                attributeId: attributeIds[j],
                value: typeof value === 'number' ? value.toString() : value,
                createdAt: new Date(),
                updatedAt: new Date()
            }).onConflictDoNothing();
        }

        console.log('✅ Seed completed successfully');
    } catch (error) {
        console.error('❌ Seed failed:', error);
    } finally {
        await db.$client.end();
    }
}

// Run the seed function
seed();