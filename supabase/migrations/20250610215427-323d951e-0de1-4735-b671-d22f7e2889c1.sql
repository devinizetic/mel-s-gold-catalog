
-- Add discount_percentage column to products table
ALTER TABLE public.products 
ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

-- Add a comment to describe the column
COMMENT ON COLUMN public.products.discount_percentage IS 'Percentage discount applied to the product (0-100)';
