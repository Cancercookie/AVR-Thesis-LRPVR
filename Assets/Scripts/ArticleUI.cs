using UnityEngine;
using UnityEngine.UI;
using Valve.VR;

public class ArticleUI : MonoBehaviour
{
    public Article article;
    private GameObject player;
    private cartHandler cart;

    private bool visible = false;
    private bool opened = false;
    [SerializeField]
    private GameObject AVR_Canvas;
    [SerializeField]
    private Camera UI_Camera;
    private Canvas canvas;
    private SteamVR_Action_Boolean interactUI;
    private ScrollRect infoScroll;
    private Image crossair;
    private Text cartCount;

    private void Awake()
    {
        crossair = UI_Camera.transform.GetComponentInChildren<Image>();
        interactUI = SteamVR_Actions._default.InteractUI;
        cart = gameObject.transform.Find("Canvas/BuyBtn/Buy").GetComponent<cartHandler>();
    }

    void Start()
    {
        cartCount = AVR_Canvas.transform.Find("Cart Count").GetComponent<Text>();
        canvas = this.GetComponentInChildren<Canvas>();
        infoScroll = AVR_Canvas.GetComponentInChildren<ScrollRect>();
        infoScroll.verticalScrollbarVisibility = ScrollRect.ScrollbarVisibility.AutoHide;
        player = GameObject.FindGameObjectWithTag("Player");
    }

    void Update()
    {
        canvas.gameObject.SetActive(visible);
        AVR_Canvas.gameObject.transform.Find("Scroll View").gameObject.SetActive(visible);
        select();
        if (visible)
        {
            cartCount.text = cart.qtInCart.ToString();
            transform.LookAt(player.transform);
        }
        else
        {
            transform.position = Vector3.zero;
        }
    }

    public void open()
    {
        visible = true;
        articlePrep();
        UIPrep();
        opened = true;
    }

    private void articlePrep()
    {
        // LOCK IN PLACE
        // KEEP HIGHLIGHTED
    }

    private void UIPrep()
    {
        transform.position = article.transform.position;
        infoScroll.GetComponentInChildren<Text>().text = article.description;
        transform.Find("Canvas/BuyBtn/Price").GetComponent<Text>().text = article.price.ToString("F") + "€";
        transform.Find("Canvas/Title/Text").GetComponent<Text>().text = article.articleName;
        cartCount.text = cart.qtInCart.ToString();
    }

    private void select()
    {
        RaycastHit hit;
        RaycastHit hitUI;
        if (Physics.Raycast(Camera.main.transform.position, Camera.main.transform.forward, out hit, 5f)) {
            article = hit.transform.GetComponent<Article>();
            if (hit.collider != null)
                crossair.transform.position = hit.point;
            else
                crossair.transform.position = transform.position + (transform.position * 5f);
            if (article != null)
                crossair.color = Color.green;
            else
                crossair.color = Color.red;
            if (interactUI.GetStateDown(SteamVR_Input_Sources.Any))
            {
                if(article != null)
                    open();
                else
                    close();
            }   
        }
    }

    public bool isActiveAndOpened()
    {
        return visible && opened;
    }

    public void close()
    {
        visible = false;
        opened = false;
    }
}

