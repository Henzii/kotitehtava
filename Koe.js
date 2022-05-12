import * as React from "react";
import { useEffect, useState } from "react";
/**
 * Komponentti taulukon luontii. Saa propseina
 * otsikon (title) sekä listan itemeistä.
 * 
 * TableItem komponentista voisi päätellä, että yksi item
 * sisältää contentin sekä osoitteen extraContentin hakuun 
 */
const TableComponent = (props) => {
    const { items, title } = props;
    // table -tagi puuttuu?
    return (
        <div className="table-component" style="padding-top: 5px;"> {/* Stylelle objekteja */}
            <tableHeader title={title} />
            {items.map((i) => {
                // Mielummin yksi, sulkeutuva komponentti kuin tyhjä, eli <TableItem />
                // mappauksessa olisi suotavaa käyttää key propsia
                return (
                    <tr>
                        <TableItem item={i}></TableItem>
                    </tr>
                );
            })}
        </div>
    );
};
/**
 * Taulun otsikkokomponentti. Otsikon jälkeen ajastin joka
 * kasvaa yhdellä joka sekuntti.
 * 
 * Ongelma: Komponenttien tulisi alkaa isolla alkukirjaimella.
 */
const tableHeader = ({ title }) => {
    const [timer, setTimer] = useState(0)
    
    /*
        Ongelma: Luo aina uuden ajastimen kun komponentti renderöityy.
        Myöskään unmounttauksessa ei poisteta ajastinta.
        Korjaus: useEffect
    */
    setInterval(() => {
        setTimer(timer + 1)
    }, 1000)
    return (

        <thead>
            <tr>
                <th>{title} {timer}</th>
            </tr>
        </thead>
    );
};

/**
 * Luo yhden taulun solun. Hakee jostain apista (href) extra sisältöä.
 * Sisällön voi avata nappia painamalla.
 */
function TableItem(props) {
    // TableComponent antaa propseina itemin eikä content ja href
    const { content, href } = props;
    const [open, setOpen] = useState(true);
    let extraContent = "";  // Oma tila tälle

    // Aiheuttaa ikuisen loopin
    if (!content) {
        setOpen(false)
    }

    // Koska extraContent ei ole tilassa ja on alkuarvoltaan tyhjä, palautetaan aina null
    // Ja jos extranContenttia ei ole niin luulisi kuitenkin, että pelkkä content haluttaisiin nähdä.
    if (!extraContent) {
        return null
    }

    // UseEffectille ei annettu riippuvuuksia.
    // Hookkia kutsutaan ehtolauseen jälkeen
    useEffect(() => {
        // Ei virheenkäsittelyä jos fetch epäonnistuu
        fetch(href).then((response) => {
            // vastaus tallennetaan muuttujaan tilan sijaan -> komponentti ei päivity -> extraContent ei tule näkymään
            extraContent = response.extraContent;
        });
    });
    return (
        <>
            <td>
                <button
                    className="table-component-toggle-content"
                    onClick={(e) => setOpen(!open)}
                >Toggle content</button>
                <span
                    style={{ display: open ? "block" : "hidden" } /* displaylle none eikä hidden */}
                    className="table-component-content"
                >
                    {content}
                </span>
                <span className="table-component-extracontent">{extraContent}</span>
            </td>
        </>
    );
}

export default TableComponent