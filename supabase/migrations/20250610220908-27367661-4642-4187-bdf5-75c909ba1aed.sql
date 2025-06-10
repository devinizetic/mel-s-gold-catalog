
-- Add discount_type column to products table
ALTER TABLE public.products 
ADD COLUMN discount_type VARCHAR(20) DEFAULT 'all' CHECK (discount_type IN ('cash', 'card', 'all'));

-- Add a comment to describe the column
COMMENT ON COLUMN public.products.discount_type IS 'Payment method for discount: cash, card, or all';
