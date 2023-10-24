import {
  faAddressCard,
  faArrowUpShortWide,
  faAward,
  faDollar,
  faEnvelope,
  faHospitalUser,
  faHouse,
  faImage,
  faMessage,
  faPenToSquare,
  faSackDollar,
  faShareNodes,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const AsideMenu = () => {
  return (
    <div className="2xl:shadow-md 2xl:block hidden p-4 rounded-lg mt-2">
      <ul className="flex flex-col gap-2">
        <li>
          <Link href="/">
            <FontAwesomeIcon
              icon={faHouse}
              className="mr-2"
            />
            <span>Homepage</span>
          </Link>
        </li>
        <li>
          <Link href="/properties">
            <FontAwesomeIcon
              icon={faHospitalUser}
              className="mr-2"
            />
            <span>Properties</span>
          </Link>
        </li>
        <li>
          <Link href="/dev/cobros">
            <FontAwesomeIcon
              icon={faDollar}
              className="mr-2"
            />
            <span>Cobros</span>
          </Link>
        </li>
        <li>
          <Link href="/dev/obtener_mas_pacientes">
            <FontAwesomeIcon
              icon={faArrowUpShortWide}
              className="mr-2"
            />
            <span>Obtener más pacientes</span>
          </Link>
        </li>
        <li>
          <Link href="/videocall">
            <FontAwesomeIcon
              icon={faVideo}
              className="mr-2"
            />
            <span>Video Conferencia</span>
          </Link>
        </li>
        <li>
          <Link href="/pacientes">
            <FontAwesomeIcon
              icon={faMessage}
              className="mr-2"
            />
            <span>Chat</span>
          </Link>
        </li>
        <li>
          <Link href="/dev/tarjeta_personal">
            <FontAwesomeIcon
              icon={faAddressCard}
              className="mr-2"
            />
            <span>Tarjeta personal</span>
          </Link>
        </li>
        <li>
          <Link href="/dev/cuadro_de_honor">
            <FontAwesomeIcon
              icon={faAward}
              className="mr-2"
            />
            <span>Cuadro de honor</span>
          </Link>
        </li>
        <li>
          <Link href="/dev/compartir_perfil">
            <FontAwesomeIcon
              icon={faShareNodes}
              className="mr-2"
            />
            <span>Compartir mi perfil</span>
          </Link>
        </li>
        <li>
          <Link href="/dev/editar_perfil">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="mr-2"
            />
            <span>Editar mi perfil</span>
          </Link>
        </li>
        <li>
          <Link href="/">
            <FontAwesomeIcon
              icon={faImage}
              className="mr-2"
            />
            <span>Publicar nota/foto/texto</span>
          </Link>
        </li>
        <li>
          <Link href="/dev/invitar_colegas">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="mr-2"
            />
            <span>Invitar colegas</span>
          </Link>
        </li>
        <li>
          <Link href="/dev/promocion">
            <FontAwesomeIcon
              icon={faSackDollar}
              className="mr-2"
            />
            <span>Promoción</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AsideMenu;
