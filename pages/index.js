import Head from 'next/head'
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { createClient } from 'contentful-management'
import { Fondamento } from 'next/font/google';
import Image from 'next/image';

const fondamento = Fondamento({ 
  subsets: ['latin'],
   weight: ['400'],
   style: ['normal', 'italic']
});

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

  const postMessage = () => {
    setMessageSendState('SENDING')
    if (formData.message.length > 0) {
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
      } else {
      setMessageSendState('EMPTY');
      setFormDisabled(false);
    }
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
        <div className="content">
          <h1 className={fondamento.className}>Mágica Intuición</h1>
          <p>La intuición es una verdad contundente y misteriosa del campo místico del conocimiento estudiado por la ciencia y la filosofía.</p>
          <p>La física cuántica nos explica que hay universos paralelos y realidades paralelas que conviven y en ocasiones interactúan entre sí. Algunos científicos afirman que la intuición es una señal propia que nos autoenviamos desde otra dimensión.</p>
          <form 
            className={`${formDisabled ? 'disabled' : ''}`} 
            onSubmit={handleFormSubmit}
          >
            <div className="form-group">
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
            <button 
              className={fondamento.className}
              type="submit"
            >
                enviar
            </button>
          </form>
          <div className="instruction">
            <p className="overlay">
              Dejá un mensaje para vos mismx en otra realidad, en otra dimensión. Esperá unos instantes y recibirás una respuesta.
            </p>
            <p className="underlay">
              Dejá un mensaje para vos mismx en otra realidad, en otra dimensión. Esperá unos instantes y recibirás una respuesta.
            </p>
          </div>
          {messageSendState == 'SUCCESS' && (
            <strong className="received-message">
              {receivedMessage}
            </strong>
          )}
          {/* {messageSendState == 'NOT SENT' && ''} */}
          {/* {messageSendState == 'SENDING' && ''} */}
          {/* {messageSendState == 'EMPTY' && ''} */}
        </div>
        <div className="grass bg-element">
          <Image
            src="/grass.png"
            fill
            alt="Grass"
            style={{
              objectFit: 'contain',
              objectPosition: 'right bottom'
            }}
          />
        </div>
        <div className="top-right bg-element">
          <Image
            src="/top-right.png"
            fill
            alt="Top Right"
            style={{
              objectFit: 'contain',
              objectPosition: 'top right'
            }}
          />
        </div>
        <div className="top-left bg-element">
          <Image
            src="/top-left.png"
            fill
            alt="Top Left"
            style={{
              objectFit: 'contain',
              objectPosition: 'top left'
            }}
          />
        </div>
        <div className="bottom-left bg-element">
          <Image
            src="/bottom-left.png"
            fill
            alt="Top Right"
            style={{
              objectFit: 'contain',
              objectPosition: 'bottom left'
            }}
          />
        </div>
      </StyledMain>
    </div>
  )
}

const StyledMain = styled.main`
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  background-size: cover;
  background-image: url('/MAGICA INTUICION.png');
  background-position: center;
  opacity: 1;
  .content {
    position: relative;
    z-index: 3;
    width: 30rem;
    max-width: 80vw;
    text-align: center;
    h1 {
      font-style: italic;
      font-weight: 400;
      font-size: 3rem;
    }
    form {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      &.disabled {
        opacity: 0.4;
        pointer-events: none;
      }
      button,
      input {
        height: 2rem;
        background: black;
        outline: none;
      }
      input {
        padding: 0 1rem;
        background: white;
        border: none;
        outline: none;
        height: 3rem;
        font-size: 1.2rem;
      }
      button {
        cursor: pointer;
        color: #1f1f21;
        background: transparent;
        border: none;
        outline: none;
        font-size: 2rem;
        /* opacity: 0.7; */
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
    .instruction {
      position: relative;
      height: 5rem;
      p {
        margin: 0;
      }
      .overlay {
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
      }
      .underlay {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        color: white;
        filter: blur(2rem);
        background: white;
      }
    }
    .received-message {
      padding: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 2rem;
      max-width: 80vw;
      padding: 2rem;
      min-height: 20rem;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      text-transform: uppercase;
      z-index: 3;
    }
  }
  .bg-element {
    position: absolute;
    z-index: 3;
  }
  .grass {
    width: 40rem;
    height: 100rem;
    bottom: 0;
    right: 0;
    max-width: 70vw;
  }
  .top-left {
    width: 25rem;
    height: 25rem;
    top: 0;
    left: 0;
    max-width: 40vw;
  }
  .top-right {
    width: 25rem;
    height: 25rem;
    top: 0;
    right: 0;
    max-width: 40vw;
  }
  .bottom-left {
    width: 20rem;
    height: 50rem;
    bottom: 0;
    left: 0;
    max-width: 20vw;
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