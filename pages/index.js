import Head from 'next/head'
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { createClient } from 'contentful-management'


export default function Home(props) {
  const [formData, setFormData] = useState({
    message: ''
  });
  const [messageSendState, setMessageSendState] = useState('NOT SENT');
  const [formDisabled, setFormDisabled] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState(undefined);

  const sanitizeString = str => {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
  }

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const client = createClient({
    accessToken: props.CONTENTFUL_MGM_KEY
  });

  const postMessage = (message) => {
    setMessageSendState('SENDING')
    client.getSpace(props.CONTENTFUL_SPACE_ID)
      .then((space) => space.getEnvironment('master'))
      .then((environment) => environment.createEntry('message', {
        fields: {
          messageContent: {
            'en-US': sanitizeString(formData.message)
          }
        }
      }))
      .then((entry) => {
        getRandomMessage(() => {
          setMessageSendState('SUCCESS');
        });
      })
      .catch((error) => {
        setMessageSendState('FAIL')
      })
  };

  const getRandomMessage = (onComplete) => {
    getAllMessages((messages) => {
      let totalMessages = messages.length;
      let randomNumber = getRandomInt(0, totalMessages);
      setReceivedMessage(messages[randomNumber].fields.messageContent['en-US']);
      onComplete();
    })
  }

  const getAllMessages = (onMessagesReceived) => {
    client.getSpace(props.CONTENTFUL_SPACE_ID)
      .then((space) => space.getEnvironment('master'))
      .then((environment) => environment.getPublishedEntries({'content_type': 'message'})) // you can add more queries as 'key': 'value'
      .then((response) => onMessagesReceived(response.items))
      .catch(console.error)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormDisabled(true)
    postMessage();
  };

  const getRandomColor = () => {
    let colors = [
      'cyan',
      'magenta',
      'yellow',
      'limegreen',
      'dodgerblue',
      'red'
    ];

    return colors[getRandomInt(0, colors.length)];
  }

  const color = getRandomColor();

  return (
    <div>
      <Head>
        <title>La Piba Berreta</title>
        <meta name="description" content="La Piba Berreta" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StyledMain overlayColor={color}>
        <div className="noise-overlay"/>
        <div className="overlay"/>
        <div className="content">
          <form 
            className={`${formDisabled ? 'disabled' : ''}`} 
            onSubmit={handleFormSubmit}
          >
            <div className="form-group">
              <label id="message">TU MENSAJE</label>
              <input 
                autoComplete='off'
                type="text" 
                name="message"
                onChange={(e) => {
                  setFormData({
                    message: e.target.value
                  })
                }}
              />
            </div>
            <button type="submit">ENVIAR</button>
          </form>
        </div>
        <strong className="received-message">
          {messageSendState == 'NOT SENT' && 'CONECTANDO CON LA INTERFAZ CUÁNTICA'}
          {messageSendState == 'SENDING' && 'RECIBIENDO MENSAJE...'}
          {messageSendState == 'SUCCESS' && receivedMessage}
        </strong>
      </StyledMain>
    </div>
  )
}

const colorChange = keyframes`
  0% {background-position: 0%}
  100% {background-position: 100%}
`;

const StyledMain = styled.main`
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  background-size: 20rem;
  background: black;
  background-color: #000000;
  opacity: 1;
  /* background: repeating-linear-gradient( 145deg, white, white 1px, #000000 1px, #000000 2rem ); */
  .noise-overlay {
    width: 100vw;
    height: 100vw;
    pointer-events: none;
    position: absolute;
    z-index: 2;
    mix-blend-mode: screen;
    background-size: 30%;
    transform: rotate(90deg);
    animation: ${colorChange} 1s infinite forwards linear;
    background-image: url('/giphy.gif');
    background-rotation: 90deg;
  }
  .overlay {
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    position: absolute;
    z-index: 4;
    background: slateblue;
    mix-blend-mode: multiply;
  }
  .content {
    position: relative;
    z-index: 3;
    background: black;
    padding: 2rem;
    width: 30rem;
    max-width: 80vw;
    border: 1px solid white;
    form {
      display: flex;
      flex-direction: column;
      color: white;
      &.disabled {
        opacity: 0.4;
        pointer-events: none;
      }
      button,
      input {
        height: 2rem;
        border: 1px solid white;
        background: black;
        color: white;
        outline: none;
        font-family: unset;
      }
      input {
        padding: 0 1rem;
      }
      button {
        cursor: pointer;
        background: white;
        color: black;
        font-family: unset;
        /* opacity: 0.7; */
        &:hover {
          background: white;
        }
      }
      .form-group {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        width: 100%;
        label {
          margin-bottom: 0.5rem;
          text-align: center;
          font-size: 2rem;
        }
      }
    }
  }
  .received-message {
    /* margin-top: 2rem; */
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 2rem;
    width: 30rem;
    max-width: 80vw;
    background: black;
    padding: 2rem;
    min-height: 20rem;
    border: 1px solid white;
    border-top: 0;
    background-image: url('/waves.gif');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    text-transform: uppercase;
    z-index: 3;
  }
`;

export async function getStaticProps() {

  return ({
    props: {
      CONTENTFUL_MGM_KEY: process.env.CONTENTFUL_MGM_KEY,
      CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID
    }
  })
}