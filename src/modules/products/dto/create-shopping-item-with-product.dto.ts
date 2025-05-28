import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { QuantityType } from 'src/modules/products/entities/shopping-item.entity';

export class CreateShoppingItemWithProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsUUID()
  category: string;

  @IsNotEmpty()
  @IsUUID()
  shoppingListId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsEnum(QuantityType)
  quantityType: QuantityType;

  @IsNotEmpty()
  location: string;

  notes?: string;
}
