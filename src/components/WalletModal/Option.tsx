import { TraceEvent } from '@uniswap/analytics'
import { BrowserEvent, InterfaceElementName, InterfaceEventName } from '@uniswap/analytics-events'
import { useAccountDrawer, useCloseAccountDrawer } from 'components/AccountDrawer'
import Loader from 'components/Icons/LoadingSpinner'
import Popover from 'components/Popover'
import { ActivationStatus, useActivationState } from 'connection/activate'
import { Connection, ConnectionType } from 'connection/types'
import { useCallback, useEffect, useState } from 'react'
import { MouseEvent } from 'react'
import { MoreHorizontal } from 'react-feather'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'
import { useIsDarkMode } from 'theme/components/ThemeToggle'
import { flexColumnNoWrap, flexRowNoWrap } from 'theme/styles'

import NewBadge from './NewBadge'

const OptionCardLeft = styled.div`
  ${flexColumnNoWrap};
  flex-direction: row;
  align-items: center;
`

const OptionCardClickable = styled.button<{ selected: boolean }>`
  background-color: ${({ theme }) => theme.backgroundModule};
  border: none;
  width: 100% !important;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 18px;

  transition: ${({ theme }) => theme.transition.duration.fast};
  opacity: ${({ disabled, selected }) => (disabled && !selected ? '0.5' : '1')};

  &:hover {
    cursor: ${({ disabled }) => !disabled && 'pointer'};
    background-color: ${({ theme, disabled }) => !disabled && theme.hoverState};
  }
  &:focus {
    background-color: ${({ theme, disabled }) => !disabled && theme.hoverState};
  }
`

const HeaderText = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.accentAction : ({ theme }) => theme.textPrimary)};
  font-size: 16px;
  font-weight: 600;
  padding: 0 8px;
`

const IconWrapper = styled.div`
  ${flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: 40px;
    width: 40px;
  }
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    align-items: flex-end;
  `};
`
const WCv2PopoverContent = styled.div`
  background: ${({ theme }) => theme.backgroundSurface};
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  border-radius: 12px;
  display: flex;
  max-width: 240px;
  padding: 20px 16px;
`
const WCv2PopoverToggle = styled.button`
  align-items: center;
  background: transparent;
  border-width: 0 0 0 1px;
  border-color: ${({ theme }) => theme.textTertiary};
  color: ${({ theme }) => theme.textTertiary};
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 0 0 0 14px;
`

export default function Option({ connection }: { connection: Connection }) {
  const { activationState, tryActivation } = useActivationState()
  const [WC2PromptOpen, setWC2PromptOpen] = useState(false)
  const closeDrawer = useCloseAccountDrawer()
  const activate = () => tryActivation(connection, closeDrawer)
  const [accountDrawerOpen] = useAccountDrawer()

  useEffect(() => {
    if (!accountDrawerOpen) setWC2PromptOpen(false)
  }, [accountDrawerOpen])

  const isSomeOptionPending = activationState.status === ActivationStatus.PENDING
  const isCurrentOptionPending = isSomeOptionPending && activationState.connection.type === connection.type
  const isDarkMode = useIsDarkMode()

  const handleWCv2Click = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setWC2PromptOpen(!WC2PromptOpen)
    },
    [WC2PromptOpen]
  )

  return (
    <TraceEvent
      events={[BrowserEvent.onClick]}
      name={InterfaceEventName.WALLET_SELECTED}
      properties={{ wallet_type: connection.getName() }}
      element={InterfaceElementName.WALLET_TYPE_OPTION}
    >
      <OptionCardClickable
        onClick={activate}
        disabled={isSomeOptionPending}
        selected={isCurrentOptionPending}
        data-testid={`wallet-option-${connection.type}`}
      >
        <OptionCardLeft>
          <IconWrapper>
            <img src={connection.getIcon?.(isDarkMode)} alt="Icon" />
          </IconWrapper>
          <HeaderText>{connection.getName()}</HeaderText>
          {connection.isNew && <NewBadge />}
        </OptionCardLeft>
        {isCurrentOptionPending ? (
          <Loader />
        ) : (
          connection.type === ConnectionType.WALLET_CONNECT && (
            <Popover
              placement="bottom"
              hideArrow
              content={
                <WCv2PopoverContent>
                  <IconWrapper style={{}}>
                    <img
                      src={connection.getIcon?.(isDarkMode)}
                      alt="Icon"
                      style={{ marginRight: '12px', width: '20px' }}
                    />
                  </IconWrapper>
                  <div>
                    <ThemedText.BodyPrimary style={{ marginBottom: '4px' }}>Connect with v2</ThemedText.BodyPrimary>
                    <ThemedText.Caption color="textSecondary">
                      Under development and unsupported by most wallets
                    </ThemedText.Caption>
                  </div>
                </WCv2PopoverContent>
              }
              show={WC2PromptOpen}
            >
              <WCv2PopoverToggle onClick={handleWCv2Click}>
                <MoreHorizontal />
              </WCv2PopoverToggle>
            </Popover>
          )
        )}
      </OptionCardClickable>
    </TraceEvent>
  )
}
