import Head from 'next/head'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
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
        setMessageSendState('SUCCESS');
        getRandomMessage();
      })
      .catch((error) => {
        setMessageSendState('FAIL')
      })
  };

  const getRandomMessage = () => {
    getAllMessages((messages) => {
      let totalMessages = messages.length;
      let randomNumber = getRandomInt(0, totalMessages);
      console.log(randomNumber)
      console.log(messages[randomNumber - 1]);
      setReceivedMessage(messages[randomNumber].fields.messageContent['en-US']);

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

  useEffect(() => {
    console.log(formData)
  }, [formData])

  return (
    <div>
      <Head>
        <title>La Piba Berreta</title>
        <meta name="description" content="La Piba Berreta" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StyledMain>
        <div className="content">
          <form 
            className={`${formDisabled ? 'disabled' : ''}`} 
            onSubmit={handleFormSubmit}
          >
            <div className="form-group">
              <label id="message">Mensaje</label>
              <input 
                type="text" 
                name="message"
                onChange={(e) => {
                  setFormData({
                    message: e.target.value
                  })
                }}
              />
            </div>
            <button type="submit">Enviar</button>
          </form>
        </div>
        {receivedMessage && (
          <strong className="received-message">{receivedMessage}</strong>
        )}
        {/* <strong>Tremendo mensaje larguísimo que vamos a user para probar si se ve bien un mensaje tan largo como este</strong> */}
         {/* <Image
          src="/giphy.gif"
          fill
          alt="background"
        /> */}
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
  background-image: url('/giphy.gif');
  background-size: 20rem;
  .content {
    position: relative;
    z-index: 1;
    background: black;
    padding: 2rem;
    width: 30rem;
    max-width: 80vw;
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
        background: lightgray;
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
        }
      }
    }
  }
  .received-message {
    margin-top: 2rem;
    color: white;
    display: inline-block;
    text-align: center;
    font-size: 2rem;
    width: 30rem;
    max-width: 80vw;
    background: black;
    padding: 2rem;
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