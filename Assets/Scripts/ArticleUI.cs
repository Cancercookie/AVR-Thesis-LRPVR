using UnityEngine;
using UnityEngine.UI;
using Valve.VR;
using UnityEditor;

public class ArticleUI : MonoBehaviour
{
    public Article article;
    private Camera player;
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
    private websockets WS;

    private void Awake()
    {
        crossair = UI_Camera.transform.GetComponentInChildren<Image>();
        interactUI = SteamVR_Actions._default.InteractUI;
        cart = gameObject.transform.Find("Canvas/AddToCartBtn/AddToCart").GetComponent<cartHandler>();
        WS = GameObject.Find("Store").GetComponent<websockets>();
    }

    void Start()
    {
        cartCount = GameObject.FindGameObjectWithTag("Cart Count").GetComponent<Text>();
        canvas = this.GetComponentInChildren<Canvas>();
        infoScroll = AVR_Canvas.GetComponentInChildren<ScrollRect>();
        infoScroll.verticalScrollbarVisibility = ScrollRect.ScrollbarVisibility.AutoHide;
        player = Camera.main;
    }

    void Update()
    {
        canvas.gameObject.SetActive(visible);
        AVR_Canvas.gameObject.transform.Find("Scroll View").gameObject.SetActive(visible);
        select();
        if (visible)
            transform.LookAt(player.transform);
        else
            transform.position = Vector3.zero;
        cartCount.text = WS.qtInCart.ToString();
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
        // KEEP HIGHLIGHTED
    }

    private void UIPrep()
    {
        transform.position = article.GetComponent<Collider>().bounds.center;
        infoScroll.GetComponentInChildren<Text>().text = article.description;
        transform.Find("Canvas/AddToCartBtn/Price").GetComponent<Text>().text = article.price.ToString("F") + "€";
        transform.Find("Canvas/Title/Text").GetComponent<Text>().text = article.articleName;
    }

    private void select()
    {
        RaycastHit hit;
        if (Physics.Raycast(Camera.main.transform.position, Camera.main.transform.forward, out hit, 5f)) {
            if (interactUI.GetStateDown(SteamVR_Input_Sources.Any))
            {
                if (hit.transform.GetComponent<Article>() != null)
                {
                    article = hit.transform.GetComponent<Article>();
                    open();
                }
                else if (hit.transform.GetComponent<Article>() != null && isActiveAndOpened())
                    close();
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

