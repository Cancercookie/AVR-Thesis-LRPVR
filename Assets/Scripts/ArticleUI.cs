using UnityEngine;
using UnityEngine.UI;
using Valve.VR;

public class ArticleUI : MonoBehaviour
{
    private float speed = 50.0f;
    public Article article;
    private GameObject player;

    private bool visible = false;
    private bool opened = false;
    [SerializeField]
    private GameObject AVR_Canvas;
    [SerializeField]
    private Camera UI_Camera;
    private Canvas canvas;
    private SteamVR_Action_Boolean interactUI;
    private ScrollRect infoScroll;

    private void Awake()
    {
        interactUI = SteamVR_Actions._default.InteractUI;
    }

    void Start()
    {
        canvas = this.GetComponentInChildren<Canvas>();
        infoScroll = AVR_Canvas.GetComponentInChildren<ScrollRect>();
        infoScroll.verticalScrollbarVisibility = ScrollRect.ScrollbarVisibility.AutoHide;
        player = GameObject.FindGameObjectWithTag("Player");
    }

    void Update()
    {
        canvas.gameObject.SetActive(visible);
        AVR_Canvas.SetActive(visible);
        select();
        if (visible)
        {
            transform.LookAt(player.transform);
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
        Text description = infoScroll.GetComponentInChildren<Text>();
        Text price = GameObject.FindWithTag("Price").GetComponent<Text>();
        Text title = GameObject.FindWithTag("Title").GetComponent<Text>();

        title.text = article.articleName;
        price.text = article.price.ToString("F") + "€";
        description.text = article.description;
    }

    private void select()
    {
        RaycastHit hit;
        if (Physics.Raycast(Camera.main.transform.position, Camera.main.transform.forward, out hit, 500f) && interactUI.GetStateDown(SteamVR_Input_Sources.Any) && !opened)
        {
            article = hit.transform.GetComponent<Article>();
            if (article != null)
            { 
                open();
            }
            else
            {
                close();
            }
        }
        else if (Physics.Raycast(UI_Camera.transform.position, Camera.main.transform.forward, out hit, 500f) && interactUI.GetStateUp(SteamVR_Input_Sources.Any) && opened)
        {
            if (hit.transform.GetComponent<cartHandler>())
            {
                addToCart();
            }
            close();
        }
    }

    public void addToCart()
    {
        
    }

    public void close()
    {
        visible = false;
        opened = false;
    }
}

