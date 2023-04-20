import { IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export const paginateResponse = (data: [any[], number], page: number, limit: number) => {
  const [result, total] = data;
  const lastPage = Math.ceil(total / limit);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;
  return {
    status: "success",
    data: [...result],
    meta: {
      count: total,
      currentPage: page,
      nextPage: nextPage,
      prevPage: prevPage,
      lastPage: lastPage,
    },
  };
};

export class QueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

export class meta {
  @ApiProperty()
  count: number;
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  nextPage: number;
  @ApiProperty()
  prevPage: number;
  @ApiProperty()
  lastPage: number;
}

export class Paginate {
  @ApiProperty()
  status: string;
  @ApiProperty()
  data: any[];
  @ApiProperty()
  meta: meta;
}
