
export type PricingMode = 'LayoutPRINCIPAL' | 'LayoutPROMO';

interface PriceTier {
    from: number; // Preço "De" (riscado)
    to: number;   // Preço "Por" (atual)
}

interface PricingStructure {
    anual: PriceTier;
    vitalicio: PriceTier;
}

export const PRICING_TABLE: Record<PricingMode, PricingStructure> = {
    // LayoutPRINCIPAL: O padrão Ouro/Gold oficial.
    LayoutPRINCIPAL: {
        anual: {
            from: 299.00,
            to: 100.00 
        },
        vitalicio: {
            from: 350.00,
            to: 150.00 
        }
    },
    // LayoutPROMO: Valores calculados para campanhas agressivas
    LayoutPROMO: {
        anual: {
            from: 299.00,
            to: 49.90
        },
        vitalicio: {
            from: 350.00,
            to: 97.00
        }
    }
};

// --- CONFIGURAÇÃO DE MODO (MUTÁVEL) ---
let currentMode: PricingMode = 'LayoutPRINCIPAL';

export const setPricingMode = (mode: PricingMode) => {
    currentMode = mode;
};

export const getPricingMode = () => currentMode;

export const getCurrentPricing = () => {
    return PRICING_TABLE[currentMode];
};

export const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
