export type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
};

export type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};