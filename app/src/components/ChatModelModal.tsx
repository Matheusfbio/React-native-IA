import { useContext, useState, useEffect } from 'react'
import { ThemeContext, AppContext } from '../context'
import { MODELS } from '../../constants'
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import { DOMAIN } from '../../constants'

export function ChatModelModal({ handlePresentModalPress }) {
  const { theme } = useContext(ThemeContext)
  const { setChatType, chatType } = useContext(AppContext)
  const [availableModels, setAvailableModels] = useState({})
  const styles = getStyles(theme)
  const options = Object.values(MODELS)

  useEffect(() => {
    checkModelAvailability()
  }, [])

  async function checkModelAvailability() {
    try {
      const response = await fetch(`${DOMAIN}/models/available`)
      const availability = await response.json()
      setAvailableModels(availability)
    } catch {
      setAvailableModels({})
    }
  }

  function _setChatType(v) {
    if (availableModels[v.label]) {
      setChatType(v)
      handlePresentModalPress()
    }
  }

  return (
    <View style={styles.bottomSheetContainer}>
      <View>
        <View style={styles.chatOptionsTextContainer}>
          <Text style={styles.chatOptionsText}>
            Language Models
          </Text>
        </View>
        {
          options.map((option, index) => {
            const isAvailable = availableModels[option.label] !== false
            return (
              <TouchableHighlight
                underlayColor={'transparent'}
                onPress={() => _setChatType(option)}
                disabled={!isAvailable}
                key={index}>
                <View style={optionContainer(theme, chatType.label, option.label, isAvailable)}>
                  <option.icon
                   size={20}
                   theme={theme}
                   selected={chatType.label === option.label}
                  />
                  <Text style={optionText(theme, chatType.label, option.label, isAvailable)}>
                    {option.name}
                  </Text>
                  <View style={styles.statusIndicator}>
                    <View style={statusDot(isAvailable)} />
                    <Text style={statusText(theme, isAvailable)}>
                      {isAvailable ? 'Disponível' : 'Indisponível'}
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>
            )
          })
        }
      </View>
    </View>
  )
}

function getStyles(theme) {
  return StyleSheet.create({
    closeIconContainer: {
      position: 'absolute',
      right: 3,
      top: 3,
    },
    chatOptionsTextContainer: {
      flexDirection: 'row',
      justifyContent:'center',
    },
    logo: {
      width: 22, height: 17,
      marginRight: 10
    },
    chatOptionsText: {
      color: theme.textColor,
      marginBottom: 22,
      textAlign: 'center',
      fontSize: 16,
      fontFamily: theme.semiBoldFont,
      marginLeft: 10
    },
    bottomSheetContainer: {
      borderColor: theme.borderColor,
      borderWidth: 1,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: theme.backgroundColor,
      marginHorizontal: 14,
      marginBottom: 24,
      borderRadius: 20
    },
    statusIndicator: {
      marginLeft: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
    }
  })
}

function optionContainer(theme, baseType, type, isAvailable = true) {
  const selected = baseType === type
  return {
    backgroundColor: selected ? theme.tintColor : theme.backgroundColor,
    padding: 12,
    borderRadius: 8,
    marginBottom: 9,
    flexDirection: 'row' as 'row',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    opacity: isAvailable ? 1 : 0.5,
  }
}

function optionText(theme, baseType, type, isAvailable = true) {
  const selected = baseType === type
  return {
    color: selected ? theme.tintTextColor : theme.textColor,
    fontFamily: theme.boldFont,
    fontSize: 15,
    shadowColor: 'rgba(0, 0, 0, .2)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginLeft: 5,
    opacity: isAvailable ? 1 : 0.5,
  }
}

function statusDot(isAvailable) {
  return {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: isAvailable ? '#4CAF50' : '#F44336',
    marginRight: 4,
  }
}

function statusText(theme, isAvailable) {
  return {
    fontSize: 12,
    color: theme.placeholderTextColor,
    opacity: isAvailable ? 1 : 0.7,
  }
}