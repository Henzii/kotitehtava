import * as React from "react";
import { useEffect, useState } from "react";
/**
 * Komponentti taulukon luontii. Saa propseina
 * otsikon (title) sekä listan itemeistä.
 * 
 * Muutokset:
 * - div:n tilalle table -tagi
 * - itemsi omaan komponenttiin
 */
const TableComponent = (props) => {
    const { items, title } = props;
    return (
        <table border="1" className="table-component" style={{ paddingTop: '5px' }}>
            <TableHeader title={title} />
            <TableItems items={items} />
        </table >
    );
};
/**
 *  Palautetaan tbody jonka sisälle mapataan itemeistä TableItemeita.
 *  Muutokset:
 *  - Lisätty tbody
 *  - TableItem itsestään sulkeutuvaksi komponentiksi
 *  - Lisätty key attribuutti TableItemille. Oletaan että jokaisella itemillä on oma id
 */
const TableItems = ({ items }) => (
    <tbody>
        {items.map(item => <TableItem item={item} key={item.id} />)}
    </tbody>
)

/**
 * Taulun otsikkokomponentti. Otsikon jälkeen ajastin joka
 * kasvaa yhdellä joka sekuntti
 * 
 * Muutokset:
 * - Ajastimen laittaminen useEffectin sisään
 * - Nimi muutettu alkamaan isolla alkukirjaimella
 * - Ajastin poistetaan kun komponentti unmountataan
 */
const TableHeader = ({ title }) => {
    const [timer, setTimer] = useState(0)

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimer((value) => value + 1)
        }, 1000)
        return () => {
            clearInterval(timerId);
        }
    }, [])
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
 * 
 * Muutokset:
 * - extraContentille oma tila
 * - open-tilan oletusarvo on false jos !content sen sijaan että se säädetään erikseen if-lausekkeessa
 * - poistettu if-lauseke jossa TableItem palautti null jos !extraContent. Tuntui vaan tyhmältä.
 * - Käsitellään mahdolliset virheet extraContentin hakemisessa
 * - Muutettiin funktio nuolifunktioksi koska muutkin ovat sellaisia
 * - Itemin toggle-nappi ja sisältö omiin komponentteihin ja soluihin
 */
const TableItem = ({ item }) => {
    const { content, href } = item;
    const [open, setOpen] = useState(!!content);
    const [extraContent, setExtraContent] = useState('');

    useEffect(() => {
        fetch(href).then((response) => {
            setExtraContent(response.extraContent);
        }).catch(() => setExtraContent('Failed to fetch extra content'));
    }, []);

    const handleToggleClick = () => setOpen((value) => !value);
    return (
        <tr>
            <ItemToggleButton onToggle={handleToggleClick} />
            <ItemContent open={open} content={content} extraContent={extraContent} />
        </tr>
    );
}
/** 
 * Sisältö, palauttaa muotoillun contentin sekä extrancontentin
 * Tuntui hassulta, että jos item on kiinni niin silti extracontent näytetään
 * eli koko homma wrapattu divin sisään joka piilotetaan tarvittaessa
**/
const ItemContent = ({ open, content, extraContent }) => (
    <td style={{ display: open ? 'block' : 'none' }}>
        <span className="table-component-content" style={{ display: 'block' }} >
            {content}
        </span>
        <span className="table-component-extracontent">
            {extraContent}
        </span>
    </td>
)
const ItemToggleButton = ({ onToggle }) => (
    <td>
        <button
            className="table-component-toggle-content"
            onClick={onToggle}
        >
            Toggle content
        </button>
    </td>
)
export default TableComponent