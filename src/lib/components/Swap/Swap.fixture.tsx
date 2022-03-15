import { TokenInfo } from '@uniswap/token-lists'
import { SupportedChainId } from 'constants/chains'
import { useUpdateAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { useValue } from 'react-cosmos/fixture'

import Swap from '.'
import { colorAtom } from './Output'

const tokenList: TokenInfo[] = [
  // POOL
  {
    address: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
    chainId: SupportedChainId.MAINNET,
    decimals: 18,
    name: 'PoolTogether',
    symbol: 'POOL',
    logoURI: 'ipfs://QmPqZ8pVyBCdw2N365t47yJ6n6beZ5X2ZxE5d1zMo4Gh2U',
  },
  {
    address: '0x25788a1a171ec66da6502f9975a15b609ff54cf6',
    chainId: SupportedChainId.POLYGON,
    decimals: 18,
    name: 'PoolTogether',
    symbol: 'POOL',
    logoURI: 'ipfs://QmPqZ8pVyBCdw2N365t47yJ6n6beZ5X2ZxE5d1zMo4Gh2U',
  },
  {
    address: '0xc4E90a8Dc6CaAb329f08ED3C8abc6b197Cf0F40A',
    chainId: SupportedChainId.RINKEBY,
    decimals: 18,
    name: 'PoolTogether',
    symbol: 'POOL',
    logoURI: 'ipfs://QmPqZ8pVyBCdw2N365t47yJ6n6beZ5X2ZxE5d1zMo4Gh2U',
  },

  // DAI
  {
    name: 'Dai Stablecoin',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    decimals: 18,
    chainId: SupportedChainId.MAINNET,
    logoURI:
      'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    name: 'Dai Stablecoin',
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    symbol: 'DAI',
    decimals: 18,
    chainId: SupportedChainId.POLYGON,
    logoURI:
      'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    name: 'Dai Stablecoin',
    address: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
    symbol: 'DAI',
    decimals: 18,
    chainId: SupportedChainId.RINKEBY,
    logoURI:
      'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },

  // USDC
  {
    name: 'USDCoin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    decimals: 6,
    chainId: SupportedChainId.MAINNET,
    logoURI:
      'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    name: 'USDCoin',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    symbol: 'USDC',
    decimals: 6,
    chainId: SupportedChainId.POLYGON,
    logoURI:
      'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    name: 'USDCoin',
    address: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
    symbol: 'USDC',
    decimals: 6,
    chainId: SupportedChainId.RINKEBY,
    logoURI:
      'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },

  // WETH
  {
    name: 'Wrapped Ether',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    decimals: 18,
    chainId: SupportedChainId.MAINNET,
    logoURI:
      'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  {
    name: 'Wrapped Ether',
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    symbol: 'WETH',
    decimals: 18,
    chainId: SupportedChainId.POLYGON,
    logoURI:
      'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  {
    name: 'Wrapped Ether',
    address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    symbol: 'WETH',
    decimals: 18,
    chainId: SupportedChainId.RINKEBY,
    logoURI:
      'https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
]

const validateColor = (() => {
  const validator = document.createElement('div').style
  return (color: string) => {
    validator.color = ''
    validator.color = color
    return validator.color !== ''
  }
})()

function Fixture() {
  const setColor = useUpdateAtom(colorAtom)
  const [color] = useValue('token color', { defaultValue: '' })
  useEffect(() => {
    if (!color || validateColor(color)) {
      setColor(color)
    }
  }, [color, setColor])

  // const [convenienceFee] = useValue('convenienceFee', { defaultValue: 100 })
  // const FEE_RECIPIENT_OPTIONS = [
  //   '',
  //   '0x1D9Cd50Dde9C19073B81303b3d930444d11552f7',
  //   '0x0dA5533d5a9aA08c1792Ef2B6a7444E149cCB0AD',
  //   '0xE6abE059E5e929fd17bef158902E73f0FEaCD68c',
  // ]
  // const [convenienceFeeRecipient] = useSelect('convenienceFeeRecipient', {
  //   options: FEE_RECIPIENT_OPTIONS,
  //   defaultValue: FEE_RECIPIENT_OPTIONS[1],
  // })

  // const optionsToAddressMap: Record<string, string | undefined> = {
  //   None: undefined,
  //   Native: 'NATIVE',
  //   DAI: DAI.address,
  //   USDC: USDC_MAINNET.address,
  // }
  // const addressOptions = Object.keys(optionsToAddressMap)

  // const [defaultInputToken] = useSelect('defaultInputToken', {
  //   options: addressOptions,
  //   defaultValue: addressOptions[1],
  // })
  // const [defaultInputAmount] = useValue('defaultInputAmount', { defaultValue: 1 })

  // const [defaultOutputToken] = useSelect('defaultOutputToken', {
  //   options: addressOptions,
  //   defaultValue: addressOptions[2],
  // })
  // const [defaultOutputAmount] = useValue('defaultOutputAmount', { defaultValue: 0 })

  return (
    <>
      <Swap
        defaultInputTokenAddress="NATIVE"
        defaultOutputTokenAddress={{
          [SupportedChainId.MAINNET]: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
          [SupportedChainId.RINKEBY]: '0xc4E90a8Dc6CaAb329f08ED3C8abc6b197Cf0F40A',
          [SupportedChainId.POLYGON]: '0x25788a1a171ec66Da6502f9975a15B609fF54CF6',
        }}
        tokenList={tokenList}
      />
    </>
  )
}

export default <Fixture />
