export type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  removeOption: (name: string) => ProductState;
};

export type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};