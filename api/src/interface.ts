export interface IAbandonedCartData {
  reference_id: string,
  reason_type: null,
  number: string,
  admin_url: string,
  customer_name: string,
  customer_email: string,
  customer_phone: string,
  billing_address: IAddress,
  shipping_address: IAddress,
  line_items: ILineItems[],
  currency: string,
  total_price: number,
  subtotal_price: number,
  referring_site: string,
  checkout_url: string,
  completed_at: string,
  original_created_at: string
}

export interface IPurchaseResponse {
  cliente: {
    cnpj?: string,
    cpf?: string,
    data_nascimento: string,
    email: string,
    id: number,
    nome: string,
    razao_social?: string,
    resource_uri: string,
    sexo: string,
    telefone_celular: string,
    telefone_principal?: string
  },
  cupom_desconto?: string,
  utm_campaign?: string,
  data_criacao: string,
  data_expiracao: string,
  data_modificacao: string,
  endereco_entrega: {
    bairro: string,
    cep: string,
    cidade: string,
    cnpj?: string,
    complemento: string,
    cpf?: string,
    endereco: string,
    estado: string,
    id: number,
    ie?: string,
    nome: string,
    numero: string,
    pais: string,
    razao_social?: string,
    referencia: string,
    rg: string,
    tipo: string
  },
  envios: IEnvios[],
  itens: IItens[],
  numero: number,
  pagamentos: IPagamentos[],
  peso_real: string,
  resource_uri: string,
  situacao: {
    aprovado: boolean,
    cancelado: boolean,
    codigo: string,
    final: boolean,
    id: number,
    nome: string,
    notificar_comprador: boolean,
    padrao: boolean,
    resource_uri: string
  },
  valor_desconto: string,
  valor_envio: string,
  valor_subtotal: string,
  valor_total: string
}

interface IPagamentos {
  forma_pagamento: {
    codigo: string,
    configuracoes: {
      ativo: boolean,
      disponivel: boolean
    },
    id: number,
    imagem: string,
    nome: string,
    resource_uri: string
  },
  id: number,
  identificador_id?: string,
  authorization_code?: string,
  pagamento_tipo: string,
  bandeira?: string,
  mensagem_gateway?: string,
  codigo_retorno_gateway?: string,
  pagamento_banco?: string,
  transacao_id?: string,
  valor: string,
  valor_pago: string
  parcelamento: {},
}

interface IItens {
  altura?: number,
  disponibilidade: number,
  id: number,
  largura?: number,
  linha: number,
  ncm: string,
  nome: string,
  pedido: string,
  peso: string,
  preco_cheio: string,
  preco_custo?: string,
  preco_promocional?: string,
  preco_subtotal: string,
  preco_venda: string,
  produto: string,
  produto_pai?: string,
  profundidade?: number,
  quantidade: string,
  sku: string,
  tipo: string
}

interface IEnvios {
  data_criacao: string,
  data_modificacao: string,
  forma_envio: {
    code: number,
    id: number,
    nome: string,
    tipo: string
  },
  id: number,
  objeto?: string,
  prazo: number,
  valor: string
}

export interface IPurchaseDataToSend {
  reference_id: string,
  number: string,
  admin_url: string,
  customer_name: string,
  customer_email: string,
  customer_phone: string,
  billing_address: IAddress,
  shipping_address: IAddress,
  line_items: ILineItems[],
  currency: string,
  total_price: number,
  subtotal_price: number,
  payment_status: string,
  payment_method: string,
  tracking_numbers: string,
  referring_site: string,
  status_url: string,
  billet_url: string,
  billet_line: string,
  billet_expired_at: string,
  original_created_at: string
}

export interface ILineItems {
  title: string,
  variant_title: string,
  quantity: number,
  price: number,
  path: string,
  image_url: string, 
  tracking_number: string
}

export interface IAddress {
  name: string,
  first_name: string,
  last_name: string,
  company: null,
  phone: string,
  address1: string,
  address2: string,
  city: string,
  province: string,
  province_code: string,
  country: string,
  country_code: string,
  zip: string,
  latitude: null,
  longitude: null
}